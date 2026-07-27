import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';
import { 
  Images, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  X, 
  Calendar, 
  Tag, 
  Sparkles,
  Building
} from 'lucide-react';

export const ReceiptGallery: React.FC = () => {
  const { transactions, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const currency = user.currency || '$';

  // Filter transactions that have a receipt attached
  const receiptTxs = transactions.filter(t => t.receiptUrl && (
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.vendorOrCustomer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.amount.toString().includes(searchQuery)
  ));

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Images className="w-5 h-5 text-[#E53935]" />
            Receipt & Bill Attachment Gallery
          </h2>
          <p className="text-xs text-slate-400">All uploaded invoices, bills, and payment receipts in one organized grid</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search receipt by merchant, amount..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-[#E53935] text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Grid List of Receipts */}
      {receiptTxs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center text-slate-400 space-y-2">
          <Images className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <div className="font-bold text-sm text-slate-700 dark:text-slate-300">No Receipt Attachments Found</div>
          <p className="text-xs">Upload bills using the AI Receipt Scanner or attach images when creating transactions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {receiptTxs.map(tx => (
            <div
              key={tx.id}
              onClick={() => { setSelectedTx(tx); setZoom(1); setRotation(0); }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition duration-200 cursor-pointer group flex flex-col"
            >
              {/* Receipt Image Thumbnail */}
              <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                <img
                  src={tx.receiptUrl}
                  alt={tx.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <span className="p-2 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-1 shadow-lg">
                    <Eye className="w-4 h-4 text-[#E53935]" /> View Receipt
                  </span>
                </div>
                {tx.ocrData && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-900/80 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1 backdrop-blur-md">
                    <Sparkles className="w-3 h-3" /> OCR Verified
                  </span>
                )}
              </div>

              {/* Card Meta details */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-[#E53935] transition">
                    {tx.title}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3" /> {tx.vendorOrCustomer}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-sm font-mono text-slate-900 dark:text-white">
                    {currency}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {tx.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{selectedTx.title}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedTx.vendorOrCustomer} • {currency}{selectedTx.amount} • {selectedTx.date}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))} className="p-1 text-slate-500 hover:text-slate-900"><ZoomOut className="w-4 h-4" /></button>
                  <span className="text-xs font-mono px-1">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(prev => Math.min(2.5, prev + 0.25))} className="p-1 text-slate-500 hover:text-slate-900"><ZoomIn className="w-4 h-4" /></button>
                  <button onClick={() => setRotation(prev => (prev + 90) % 360)} className="p-1 text-slate-500 hover:text-slate-900"><RotateCw className="w-4 h-4" /></button>
                </div>

                <a
                  href={selectedTx.receiptUrl}
                  download={selectedTx.receiptFileName || 'receipt.png'}
                  className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100"
                  title="Download Image"
                >
                  <Download className="w-4 h-4" />
                </a>

                <button onClick={() => setSelectedTx(null)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image View */}
            <div className="p-6 bg-slate-950 flex-1 overflow-hidden flex items-center justify-center min-h-[300px]">
              <img
                src={selectedTx.receiptUrl}
                alt="Receipt"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease-out'
                }}
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
