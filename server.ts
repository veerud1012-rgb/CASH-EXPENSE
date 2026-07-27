import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_TRANSACTIONS, DEFAULT_CATEGORIES, DEFAULT_USER, INITIAL_AUDIT_LOGS } from './src/data/initialData';
import { Transaction, Category, UserProfile, OCRResult, AuditLog } from './src/types';

// In-memory application store with fallback persistence
let transactionsStore: Transaction[] = [...INITIAL_TRANSACTIONS];
let categoriesStore: Category[] = [...DEFAULT_CATEGORIES];
let userProfileStore: UserProfile = { ...DEFAULT_USER };
let auditLogsStore: AuditLog[] = [...INITIAL_AUDIT_LOGS];

// Data directory for persistence
const DATA_FILE = path.join(process.cwd(), 'data_store.json');

// Load stored data if exists
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.transactions && Array.isArray(parsed.transactions)) {
      const demoIds = new Set(['tx_101', 'tx_102', 'tx_103', 'tx_104', 'tx_105', 'tx_106', 'tx_107']);
      transactionsStore = parsed.transactions.filter((t: Transaction) => !demoIds.has(t.id));
    }
    if (parsed.categories) categoriesStore = parsed.categories;
    if (parsed.userProfile) userProfileStore = parsed.userProfile;
    if (parsed.auditLogs) auditLogsStore = parsed.auditLogs;
    console.log('Loaded cash expense store from disk.');
  }
} catch (e) {
  console.warn('Could not read stored data file, using initial data:', e);
}

function saveDataToDisk() {
  try {
    const data = {
      transactions: transactionsStore,
      categories: categoriesStore,
      userProfile: userProfileStore,
      auditLogs: auditLogsStore
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save store to disk:', e);
  }
}

// Server-side Gemini initialization
let ai: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY || '';
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Request logger middleware
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.url}`);
    }
    next();
  });

  // --- AUTH ROUTES ---
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    // Simple demo auth validation
    userProfileStore.email = email;
    if (email.includes('admin')) {
      userProfileStore.role = 'admin';
    }
    
    auditLogsStore.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: userProfileStore.name,
      action: 'LOGIN',
      module: 'AUTH',
      details: `Logged in as ${email}`
    });
    saveDataToDisk();

    res.json({
      success: true,
      user: userProfileStore,
      token: 'demo_jwt_token_cashexpense_' + Date.now()
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, companyName } = req.body;
    userProfileStore = {
      ...userProfileStore,
      name: name || 'New User',
      email: email || 'user@cashexpense.app',
      companyName: companyName || 'My Enterprise'
    };
    saveDataToDisk();

    res.json({
      success: true,
      user: userProfileStore,
      token: 'demo_jwt_token_cashexpense_' + Date.now()
    });
  });

  app.get('/api/auth/profile', (req, res) => {
    res.json({ success: true, user: userProfileStore });
  });

  app.put('/api/auth/profile', (req, res) => {
    userProfileStore = { ...userProfileStore, ...req.body };
    saveDataToDisk();
    res.json({ success: true, user: userProfileStore });
  });

  // --- TRANSACTIONS API ---
  app.get('/api/transactions', (req, res) => {
    res.json({ success: true, transactions: transactionsStore });
  });

  app.post('/api/transactions', (req, res) => {
    const newTx: Transaction = {
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      status: 'Completed',
      createdBy: userProfileStore.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          timestamp: new Date().toISOString(),
          action: 'Created Transaction',
          user: userProfileStore.name
        }
      ],
      ...req.body
    };

    transactionsStore.unshift(newTx);
    
    auditLogsStore.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: userProfileStore.name,
      action: 'CREATE_TRANSACTION',
      module: 'TRANSACTIONS',
      details: `Added ${newTx.type} of ${userProfileStore.currency}${newTx.amount} - ${newTx.title}`
    });

    saveDataToDisk();
    res.json({ success: true, transaction: newTx });
  });

  app.put('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    const index = transactionsStore.findIndex(t => t.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const existing = transactionsStore[index];
    const updatedHistory = existing.history || [];
    updatedHistory.push({
      timestamp: new Date().toISOString(),
      action: 'Updated details',
      user: userProfileStore.name
    });

    const updated: Transaction = {
      ...existing,
      ...req.body,
      updatedAt: new Date().toISOString(),
      history: updatedHistory
    };

    transactionsStore[index] = updated;
    saveDataToDisk();

    res.json({ success: true, transaction: updated });
  });

  app.delete('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    const existing = transactionsStore.find(t => t.id === id);
    transactionsStore = transactionsStore.filter(t => t.id !== id);
    
    if (existing) {
      auditLogsStore.unshift({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: userProfileStore.name,
        action: 'DELETE_TRANSACTION',
        module: 'TRANSACTIONS',
        details: `Deleted ${existing.title} (${userProfileStore.currency}${existing.amount})`
      });
    }

    saveDataToDisk();
    res.json({ success: true, message: 'Transaction deleted successfully' });
  });

  // --- CATEGORIES API ---
  app.get('/api/categories', (req, res) => {
    res.json({ success: true, categories: categoriesStore });
  });

  app.post('/api/categories', (req, res) => {
    const { name, type, iconName, color } = req.body;
    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Category name and type required' });
    }

    const newCat: Category = {
      id: `cat_custom_${Date.now()}`,
      name,
      type,
      iconName: iconName || 'Tag',
      color: color || '#E53935',
      isCustom: true
    };

    categoriesStore.push(newCat);
    saveDataToDisk();
    res.json({ success: true, category: newCat });
  });

  app.delete('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    categoriesStore = categoriesStore.filter(c => c.id !== id);
    saveDataToDisk();
    res.json({ success: true, message: 'Category deleted' });
  });

  // --- OCR / AI RECEIPT PROCESSING API ---
  app.post('/api/ocr/extract', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/png' } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ success: false, message: 'Receipt image data is required' });
      }

      // Format base64 properly
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const genAI = getGeminiClient();

      const imagePart = {
        inlineData: {
          mimeType: mimeType.includes('pdf') ? 'application/pdf' : mimeType,
          data: cleanBase64
        }
      };

      const promptText = `Analyze this bill or receipt image with high precision OCR. Extract the following structured fields:
1. Merchant/Vendor Name
2. Date (format YYYY-MM-DD if found, otherwise estimate or today's date)
3. Time (HH:mm format if found)
4. Total Amount (numeric number)
5. GST / Tax Amount (numeric number, 0 if not present)
6. Bill Number / Invoice Number / Receipt Number
7. Payment Method (Choose one: 'Cash', 'UPI', 'Cheque', 'Bank Transfer', 'Credit Card', 'Debit Card', 'Wallet', 'Net Banking', 'QR Payment', 'Other')
8. Suggested Category (e.g. Office Expense, Travel, Electricity, Internet, Salary Paid, Rent, Maintenance, Food, Marketing, Transport, Fuel, Tax, Stationery, Miscellaneous, Sales, Investment, Salary, Commission, Refund, Interest)
9. Transaction Type ('income' or 'expense')
10. Line Items list if available (item name, quantity, unit or total price)
11. Merchant Address
12. Merchant Phone Number
13. OCR Confidence score between 0.80 and 0.99`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: {
          parts: [
            imagePart,
            { text: promptText }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              merchantName: { type: Type.STRING },
              date: { type: Type.STRING },
              time: { type: Type.STRING },
              totalAmount: { type: Type.NUMBER },
              gstAmount: { type: Type.NUMBER },
              taxAmount: { type: Type.NUMBER },
              billNumber: { type: Type.STRING },
              invoiceNumber: { type: Type.STRING },
              paymentMethod: { type: Type.STRING },
              suggestedCategory: { type: Type.STRING },
              type: { type: Type.STRING },
              vendorName: { type: Type.STRING },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                    price: { type: Type.NUMBER }
                  }
                }
              },
              address: { type: Type.STRING },
              phoneNumber: { type: Type.STRING },
              rawText: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            },
            required: ['merchantName', 'totalAmount', 'date', 'suggestedCategory']
          }
        }
      });

      const extractedText = response.text || '{}';
      const ocrResult: OCRResult = JSON.parse(extractedText);

      // Sanitize fields
      ocrResult.totalAmount = Math.abs(Number(ocrResult.totalAmount) || 0);
      ocrResult.confidence = Number(ocrResult.confidence) || 0.95;
      if (!ocrResult.date) ocrResult.date = new Date().toISOString().split('T')[0];
      if (!ocrResult.type) ocrResult.type = 'expense';

      // Check for duplicate transaction
      const duplicate = transactionsStore.find(
        t => Math.abs(t.amount - ocrResult.totalAmount) < 0.01 &&
             t.date === ocrResult.date &&
             (t.vendorOrCustomer.toLowerCase().includes((ocrResult.merchantName || '').toLowerCase()) ||
              (ocrResult.merchantName || '').toLowerCase().includes(t.vendorOrCustomer.toLowerCase()))
      );

      if (duplicate) {
        ocrResult.duplicateDetected = true;
        ocrResult.duplicateTransactionId = duplicate.id;
      }

      auditLogsStore.unshift({
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: userProfileStore.name,
        action: 'OCR_EXTRACT',
        module: 'AI_OCR',
        details: `Auto-extracted bill from ${ocrResult.merchantName} for ${userProfileStore.currency}${ocrResult.totalAmount}`
      });

      saveDataToDisk();
      res.json({ success: true, ocrData: ocrResult });
    } catch (error: any) {
      console.error('OCR Extraction Error:', error);
      // Fallback response if Gemini AI has issue or fallback simulation
      res.status(500).json({
        success: false,
        message: 'OCR processing failed. You can manually enter details.',
        error: error?.message
      });
    }
  });

  // --- SMART AI CATEGORY & DUPLICATE CHECK API ---
  app.post('/api/ai/suggest', async (req, res) => {
    try {
      const { title, vendor, amount, description } = req.body;
      const genAI = getGeminiClient();

      const prompt = `Given this financial transaction:
Title: ${title}
Vendor/Customer: ${vendor}
Amount: ${amount}
Description: ${description || ''}

Recommend the best category from this list: ${categoriesStore.map(c => c.name).join(', ')}.
And recommend whether it is an 'income' or 'expense'.
Return a JSON object with 'suggestedCategory' and 'type'.`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestedCategory: { type: Type.STRING },
              type: { type: Type.STRING }
            }
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.json({ success: false, suggestedCategory: 'Miscellaneous', type: 'expense' });
    }
  });

  // --- BACKUP & AUDIT LOGS API ---
  app.get('/api/backup/export', (req, res) => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      userProfile: userProfileStore,
      transactions: transactionsStore,
      categories: categoriesStore,
      auditLogs: auditLogsStore
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=cash_expense_backup.json');
    res.send(JSON.stringify(backupData, null, 2));
  });

  app.post('/api/backup/import', (req, res) => {
    try {
      const { transactions, categories, userProfile } = req.body;
      if (Array.isArray(transactions)) transactionsStore = transactions;
      if (Array.isArray(categories)) categoriesStore = categories;
      if (userProfile) userProfileStore = userProfile;

      saveDataToDisk();
      res.json({ success: true, message: 'Backup restored successfully!' });
    } catch (e: any) {
      res.status(400).json({ success: false, message: 'Invalid backup file format' });
    }
  });

  app.get('/api/admin/audit-logs', (req, res) => {
    res.json({ success: true, logs: auditLogsStore });
  });

  // --- VITE MIDDLEWARE OR STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CASH EXPENSE server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
