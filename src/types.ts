export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 
  | 'Cash' 
  | 'UPI' 
  | 'Cheque' 
  | 'Bank Transfer' 
  | 'Credit Card' 
  | 'Debit Card' 
  | 'Wallet' 
  | 'Net Banking' 
  | 'QR Payment' 
  | 'Other';

export type TransactionStatus = 'Completed' | 'Pending' | 'Draft' | 'Flagged';

export interface OCRItem {
  name: string;
  quantity?: number;
  price?: number;
}

export interface OCRResult {
  merchantName: string;
  date: string;
  time?: string;
  totalAmount: number;
  gstAmount?: number;
  taxAmount?: number;
  billNumber?: string;
  invoiceNumber?: string;
  paymentMethod?: PaymentMethod;
  suggestedCategory?: string;
  type?: TransactionType;
  vendorName?: string;
  items?: OCRItem[];
  address?: string;
  phoneNumber?: string;
  rawText?: string;
  confidence: number;
  duplicateDetected?: boolean;
  duplicateTransactionId?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  description?: string;
  amount: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  category: string;
  paymentType: PaymentMethod;
  source?: string;
  referenceNumber?: string;
  vendorOrCustomer: string;
  notes?: string;
  receiptUrl?: string; // base64 or object URL
  receiptFileName?: string;
  status: TransactionStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  ocrData?: OCRResult;
  history?: Array<{
    timestamp: string;
    action: string;
    user: string;
    details?: string;
  }>;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  iconName: string;
  color: string;
  isCustom?: boolean;
  budgetLimit?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  companyName: string;
  currency: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'system';
  avatar?: string;
  notificationsEnabled: boolean;
  largeExpenseThreshold: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  cashInHand: number;
  bankBalance: number;
  upiBalance: number;
  chequePending: number;
  todaysIncome: number;
  todaysExpense: number;
  thisMonthIncome: number;
  thisMonthExpense: number;
  netProfit: number;
  monthlyGrowthPercent: number;
  averageDailyExpense: number;
  averageMonthlyExpense: number;
  largestExpense: number;
  largestIncome: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
}

export interface FilterState {
  searchQuery: string;
  type: 'all' | 'income' | 'expense';
  category: string;
  paymentMethod: string;
  vendorCustomer: string;
  dateRange: 'all' | 'today' | 'this_week' | 'this_month' | 'this_year' | 'custom';
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  status: string;
}
