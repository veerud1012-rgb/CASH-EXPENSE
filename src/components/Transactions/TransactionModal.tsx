import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction, PaymentMethod, TransactionType } from '../../types';
import { PAYMENT_METHODS } from '../../utils/paymentIcons';
import { 
  X, 
  Upload, 
  Camera, 
  Sparkles, 
  Plus, 
  Receipt, 
  DollarSign, 
  Tag, 
  Calendar, 
  Clock, 
  Building, 
  FileText,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const TransactionModal: React.FC = () => {
  const { 
    isTransactionModalOpen, 
    setIsTransactionModalOpen, 
    editingTransaction, 
    categories, 
    addTransaction, 
    updateTransaction,
    processReceiptOCR,
    user
  } = useApp();

  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
  const [category, setCategory] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentMethod>('Cash');
  const [source, setSource] = useState('Main Account');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [vendorOrCustomer, setVendorOrCustomer] = useState('');
  const [notes, setNotes] = useState('');
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>(undefined);
  const [receiptFileName, setReceiptFileName] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<'Completed' | 'Pending' | 'Draft'>('Completed');

  const [isOCRLoading, setIsOCRLoading] = useState(false);
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setTitle(editingTransaction.title);
      setDescription(editingTransaction.description || '');
      setAmount(editingTransaction.amount.toString());
      setDate(editingTransaction.date);
      setTime(editingTransaction.time);
      setCategory(editingTransaction.category);
      setPaymentType(editingTransaction.paymentType);
      setSource(editingTransaction.source || '');
      setReferenceNumber(editingTransaction.referenceNumber || '');
      setVendorOrCustomer(editingTransaction.vendorOrCustomer);
      setNotes(editingTransaction.notes || '');
      setReceiptUrl(editingTransaction.receiptUrl);
      setReceiptFileName(editingTransaction.receiptFileName);
      setStatus(editingTransaction.status as any);
    } else {
      setType('expense');
      setTitle('');
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      const defaultExpCat = categories.find(c => c.type === 'expense')?.name || 'Office Expense';
      setCategory(defaultExpCat);
      setPaymentType('Cash');
      setSource('Main Account');
      setReferenceNumber(`REF-${Math.floor(100000 + Math.random() * 900000)}`);
      setVendorOrCustomer('');
      setNotes('');
      setReceiptUrl(undefined);
      setReceiptFileName(undefined);
      setStatus('Completed');
    }
    setOcrSuccessMsg(null);
  }, [editingTransaction, isTransactionModalOpen, categories]);

  if (!isTransactionModalOpen) return null;

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setReceiptUrl(base64);

      // Auto-run OCR
      setIsOCRLoading(true);
      try {
        const ocrData = await processReceiptOCR(base64, file.type);
        if (ocrData) {
          if (ocrData.merchantName) {
            setVendorOrCustomer(ocrData.merchantName);
            if (!title) setTitle(`Bill: ${ocrData.merchantName}`);
          }
          if (ocrData.totalAmount) setAmount(ocrData.totalAmount.toString());
          if (ocrData.date) setDate(ocrData.date);
          if (ocrData.time) setTime(ocrData.time);
          if (ocrData.billNumber) setReferenceNumber(ocrData.billNumber);
          if (ocrData.paymentMethod) setPaymentType(ocrData.paymentMethod);
          if (ocrData.suggestedCategory) setCategory(ocrData.suggestedCategory);
          if (ocrData.type) setType(ocrData.type);
          
          setOcrSuccessMsg(`AI extracted total ${user.currency}${ocrData.totalAmount} from ${ocrData.merchantName}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsOCRLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid title and positive amount.');
      return;
    }

    const txData = {
      type,
      title,
      description,
      amount: parseFloat(amount),
      date,
      time,
      category: category || (type === 'income' ? 'Sales' : 'Office Expense'),
      paymentType,
      source,
      referenceNumber,
      vendorOrCustomer: vendorOrCustomer || 'General',
      notes,
      receiptUrl,
      receiptFileName,
      status
    };

    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, txData);
    } else {
      await addTransaction(txData);
    }

    setIsTransactionModalOpen(false);
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${type === 'income' ? 'bg-emerald-500' : 'bg-[#E53935]'}`}></span>
              {editingTransaction ? 'Edit Financial Record' : 'Record New Transaction'}
            </h3>
            <p className="text-xs text-slate-400">Track company income, bills, and daily cash flow</p>
          </div>
          <button
            onClick={() => setIsTransactionModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Income vs Expense Toggle */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (!category || !filteredCategories.some(c => c.name === category)) {
                  setCategory(categories.find(c => c.type === 'expense')?.name || 'Office Expense');
                }
              }}
              className={`py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                type === 'expense'
                  ? 'bg-[#E53935] text-white shadow-md shadow-red-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Expense / Bill Out</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                if (!category || !filteredCategories.some(c => c.name === category)) {
                  setCategory(categories.find(c => c.type === 'income')?.name || 'Sales');
                }
              }}
              className={`py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Income / Payment In</span>
            </button>
          </div>

          {/* AI OCR Receipt Attachment Dropzone */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 relative group text-center">
            {isOCRLoading ? (
              <div className="py-4 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 text-[#E53935] animate-spin" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  AI OCR is scanning bill & extracting amount...
                </span>
              </div>
            ) : receiptUrl ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={receiptUrl} alt="Receipt Preview" className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm" />
                  <div className="text-left text-xs">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs">{receiptFileName || 'Uploaded Bill'}</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Attached & Processed
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setReceiptUrl(undefined); setReceiptFileName(undefined); setOcrSuccessMsg(null); }}
                  className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-[#E53935] text-xs font-medium hover:bg-rose-200 transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block py-2">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-[#E53935] mx-auto flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1">
                  Upload Bill / Receipt Image <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Drag & drop or click to auto-fill form using Gemini AI OCR</p>
                <input type="file" accept="image/*,.pdf" onChange={handleReceiptUpload} className="hidden" />
              </label>
            )}

            {ocrSuccessMsg && (
              <div className="mt-2 p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs flex items-center justify-center gap-1 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {ocrSuccessMsg}
              </div>
            )}
          </div>

          {/* Title & Amount Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transaction Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === 'expense' ? 'e.g., Broadband Bill, Office Chairs' : 'e.g., Client Retainer, Consulting Fee'}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#E53935] outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount ({user.currency}) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{user.currency}</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3.5 py-2.5 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#E53935] outline-none text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Category & Payment Method Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#E53935] outline-none text-slate-900 dark:text-slate-100"
              >
                {filteredCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Type / Source *
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#E53935] outline-none text-slate-900 dark:text-slate-100"
              >
                {PAYMENT_METHODS.map(pm => (
                  <option key={pm} value={pm}>{pm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payee/Payer Name & Ref Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payee / Payer Name
              </label>
              <input
                type="text"
                value={vendorOrCustomer}
                onChange={(e) => setVendorOrCustomer(e.target.value)}
                placeholder={type === 'expense' ? 'e.g. Comcast, IKEA (Payee)' : 'e.g. Acme Corp (Payer)'}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#E53935] outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Invoice / Ref Number
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="e.g. INV-90123"
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#E53935] outline-none text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#E53935] outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="12:00"
                className="w-full px-3.5 py-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#E53935] outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#E53935] outline-none text-slate-900 dark:text-slate-100"
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Internal Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add payment context, tax deduction notes, or warranty info..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#E53935] outline-none text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsTransactionModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-500/30 active:scale-95 transition"
            >
              {editingTransaction ? 'Save Changes' : 'Record Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
