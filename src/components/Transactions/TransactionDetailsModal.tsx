import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';
import { getPaymentMethodIcon } from '../../utils/paymentIcons';
import { 
  X, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Calendar, 
  Clock, 
  Building, 
  Tag, 
  CreditCard, 
  Sparkles, 
  History, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Receipt,
  FileCheck
} from 'lucide-react';

export const TransactionDetailsModal: React.FC<{ 
  transaction: Transaction | null; 
  onClose: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}> = ({ transaction, onClose, onEdit, onDelete }) => {
  const { user } = useApp();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!transaction) return null;

  const isInc = transaction.type === 'income';
  const PaymentIcon = getPaymentMethodIcon(transaction.paymentType);
  const currency = user.currency || '$';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${isInc ? 'bg-emerald-500' : 'bg-[#E53935]'}`}>
              {isInc ? '+' : '-'}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>{transaction.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold ${
                  isInc ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-950 text-rose-700 dark:text-rose-300'
                }`}>
                  {transaction.type}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">Ref: {transaction.referenceNumber || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#E53935] transition"
              title="Edit Transaction"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this financial record?')) {
                  onDelete(transaction.id);
                  onClose();
                }
              }}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-[#E53935] hover:bg-rose-100 transition"
              title="Delete Transaction"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Amount Display Header Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-center shadow-lg">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Amount</div>
              <div className={`text-3xl font-black font-mono mt-0.5 ${isInc ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isInc ? '+' : '-'}{currency}{transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Payment Method</div>
              <div className="font-bold text-sm text-white flex items-center justify-end gap-1.5 mt-0.5">
                <PaymentIcon className="w-4 h-4 text-rose-400" />
                <span>{transaction.paymentType}</span>
              </div>
            </div>
          </div>

          {/* Key Attribute Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="text-slate-400 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5" /> Date & Time
              </div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                {transaction.date} {transaction.time}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="text-slate-400 flex items-center gap-1 mb-1">
                <Tag className="w-3.5 h-3.5 text-rose-500" /> Category
              </div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {transaction.category}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="text-slate-400 flex items-center gap-1 mb-1">
                <Building className="w-3.5 h-3.5 text-blue-500" /> Payee / Payer
              </div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {transaction.vendorOrCustomer}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
              <div className="text-slate-400 flex items-center gap-1 mb-1">
                <FileCheck className="w-3.5 h-3.5 text-emerald-500" /> Status
              </div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400">
                {transaction.status}
              </div>
            </div>
          </div>

          {/* Receipt View Section */}
          {transaction.receiptUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-[#E53935]" /> Uploaded Receipt / Bill Attachment
                </h4>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono px-1">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setRotation(prev => (prev + 90) % 360)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
                    title="Rotate"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 overflow-hidden flex items-center justify-center min-h-[220px]">
                <img
                  src={transaction.receiptUrl}
                  alt="Bill Receipt"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transition: 'transform 0.2s ease-out'
                  }}
                  className="max-h-72 max-w-full object-contain rounded-lg shadow-xl"
                />
              </div>
            </div>
          )}

          {/* AI OCR Extracted Data breakdown */}
          {transaction.ocrData && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" /> AI OCR Analysis Breakdown
                </span>
                <span className="font-mono text-[10px] text-amber-600 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full font-bold">
                  {Math.round(transaction.ocrData.confidence * 100)}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div><strong className="text-slate-400">Extracted Merchant:</strong> {transaction.ocrData.merchantName}</div>
                <div><strong className="text-slate-400">Bill #:</strong> {transaction.ocrData.billNumber || 'N/A'}</div>
                <div><strong className="text-slate-400">Tax/GST:</strong> {currency}{transaction.ocrData.taxAmount || 0}</div>
                <div><strong className="text-slate-400">Phone:</strong> {transaction.ocrData.phoneNumber || 'N/A'}</div>
                <div className="col-span-2"><strong className="text-slate-400">Address:</strong> {transaction.ocrData.address || 'N/A'}</div>
              </div>

              {transaction.ocrData.items && transaction.ocrData.items.length > 0 && (
                <div className="border-t border-amber-500/20 pt-2">
                  <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                    Extracted Line Items
                  </div>
                  <div className="space-y-1">
                    {transaction.ocrData.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
                        <span>{item.quantity ? `${item.quantity}x ` : ''}{item.name}</span>
                        <span className="font-mono font-medium">{currency}{item.price || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Audit History Timeline */}
          {transaction.history && transaction.history.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <History className="w-4 h-4 text-slate-400" /> Audit Trail & Record History
              </h4>
              <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 pl-3 ml-2 text-xs">
                {transaction.history.map((hist, index) => (
                  <div key={index} className="relative">
                    <div className="w-2 h-2 rounded-full bg-red-500 absolute -left-[17px] top-1"></div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{hist.action}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {new Date(hist.timestamp).toLocaleString()} by {hist.user}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
