import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';
import { getPaymentMethodIcon } from '../../utils/paymentIcons';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Eye, 
  Receipt, 
  Clock, 
  Calendar, 
  FileText, 
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const RecentTransactionsOverview: React.FC<{ onViewDetails: (tx: Transaction) => void }> = ({ onViewDetails }) => {
  const { transactions, setActiveTab, user } = useApp();
  const currency = user.currency || '$';

  const recentTxs = transactions.slice(0, 6);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">Recent Transactions</h3>
        <button
          onClick={() => setActiveTab('transactions')}
          className="text-xs font-bold text-[#E53935] hover:underline cursor-pointer flex items-center gap-1"
        >
          View All Transactions <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        {recentTxs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">No recent transactions recorded.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-6 py-3 font-bold">Transaction</th>
                <th className="px-6 py-3 font-bold">Category</th>
                <th className="px-6 py-3 font-bold">Method</th>
                <th className="px-6 py-3 font-bold">Date</th>
                <th className="px-6 py-3 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800/60">
              {recentTxs.map((tx) => {
                const isInc = tx.type === 'income';
                const PaymentIcon = getPaymentMethodIcon(tx.paymentType);

                return (
                  <tr
                    key={tx.id}
                    onClick={() => onViewDetails(tx)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition cursor-pointer"
                  >
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs md:text-sm flex items-center gap-2">
                        <span>{tx.title}</span>
                        {tx.ocrData && (
                          <span className="px-1.5 py-0.5 text-[9px] bg-red-50 dark:bg-red-950/80 text-[#E53935] rounded font-mono flex items-center gap-0.5 font-bold">
                            <Sparkles className="w-2.5 h-2.5 text-amber-500" /> AI OCR
                          </span>
                        )}
                        {tx.receiptUrl && (
                          <Receipt className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{tx.vendorOrCustomer}</div>
                    </td>

                    <td className="px-6 py-3.5">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded text-[11px] font-bold">
                        {tx.category}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <PaymentIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{tx.paymentType}</span>
                      </div>
                    </td>

                    <td className="px-6 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {tx.date}
                    </td>

                    <td className={`px-6 py-3.5 text-right font-extrabold text-sm font-mono ${
                      isInc ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                    }`}>
                      {isInc ? '+' : '-'}{currency}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
