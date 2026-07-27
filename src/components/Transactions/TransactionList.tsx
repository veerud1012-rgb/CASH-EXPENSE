import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';
import { getPaymentMethodIcon } from '../../utils/paymentIcons';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt, 
  Sparkles, 
  Plus, 
  Download, 
  Eye, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  X,
  FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const TransactionList: React.FC<{
  onSelectTransaction: (tx: Transaction) => void;
}> = ({ onSelectTransaction }) => {
  const { 
    filteredTransactions, 
    filterState, 
    setFilterState, 
    categories, 
    setIsTransactionModalOpen, 
    setEditingTransaction,
    deleteTransaction,
    user 
  } = useApp();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currency = user.currency || '$';

  // Pagination calculation
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTxs = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const dataToExport = filteredTransactions.map(t => ({
      ID: t.id,
      Type: t.type,
      Title: t.title,
      Amount: t.amount,
      Currency: currency,
      Category: t.category,
      PaymentType: t.paymentType,
      VendorOrCustomer: t.vendorOrCustomer,
      Date: t.date,
      Time: t.time,
      ReferenceNumber: t.referenceNumber || '',
      Status: t.status,
      Notes: t.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    XLSX.writeFile(workbook, `cash_expense_transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const resetFilters = () => {
    setFilterState({
      searchQuery: '',
      type: 'all',
      category: 'all',
      paymentMethod: 'all',
      vendorCustomer: 'all',
      dateRange: 'all',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      status: 'all'
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
      {/* Search & Filter Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filterState.searchQuery}
            onChange={(e) => setFilterState(prev => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search by vendor, title, amount, notes, ref number..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#E53935] outline-none text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Type Quick Buttons */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setFilterState(prev => ({ ...prev, type: 'all' }))}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${filterState.type === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterState(prev => ({ ...prev, type: 'income' }))}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${filterState.type === 'income' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500'}`}
            >
              Income
            </button>
            <button
              onClick={() => setFilterState(prev => ({ ...prev, type: 'expense' }))}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${filterState.type === 'expense' ? 'bg-[#E53935] text-white shadow-sm' : 'text-slate-500'}`}
            >
              Expense
            </button>
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              showAdvancedFilters 
                ? 'bg-rose-50 dark:bg-rose-950 text-[#E53935] border-rose-200 dark:border-rose-900' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle Advanced Filters"
          >
            <Filter className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 transition cursor-pointer"
            title="Export Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      {showAdvancedFilters && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
          <div className="flex justify-between items-center font-bold text-slate-700 dark:text-slate-300">
            <span>Advanced Filters</span>
            <button onClick={resetFilters} className="text-[#E53935] text-[11px] hover:underline cursor-pointer">
              Reset All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Category</label>
              <select
                value={filterState.category}
                onChange={(e) => setFilterState(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Date Range</label>
              <select
                value={filterState.dateRange}
                onChange={(e) => setFilterState(prev => ({ ...prev, dateRange: e.target.value as any }))}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this_week">Past 7 Days</option>
                <option value="this_month">This Month</option>
                <option value="this_year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Min Amount ({currency})</label>
              <input
                type="number"
                value={filterState.minAmount}
                onChange={(e) => setFilterState(prev => ({ ...prev, minAmount: e.target.value }))}
                placeholder="0"
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Max Amount ({currency})</label>
              <input
                type="number"
                value={filterState.maxAmount}
                onChange={(e) => setFilterState(prev => ({ ...prev, maxAmount: e.target.value }))}
                placeholder="10000"
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="p-3">Title & Vendor</th>
              <th className="p-3">Category</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {paginatedTxs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No transactions match the selected filters.
                </td>
              </tr>
            ) : (
              paginatedTxs.map((tx) => {
                const isInc = tx.type === 'income';
                const PaymentIcon = getPaymentMethodIcon(tx.paymentType);

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                    onClick={() => onSelectTransaction(tx)}
                  >
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-[#E53935] flex items-center gap-1.5">
                        <span>{tx.title}</span>
                        {tx.ocrData && (
                          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" title="AI OCR Extracted" />
                        )}
                        {tx.receiptUrl && (
                          <Receipt className="w-3.5 h-3.5 text-slate-400 shrink-0" title="Has Receipt Attachment" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{tx.vendorOrCustomer}</div>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                        {tx.category}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                        <PaymentIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>{tx.paymentType}</span>
                      </div>
                    </td>

                    <td className="p-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {tx.date}
                    </td>

                    <td className={`p-3 text-right font-extrabold font-mono text-sm ${
                      isInc ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {isInc ? '+' : '-'}{currency}{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onSelectTransaction(tx)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingTransaction(tx);
                            setIsTransactionModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete transaction?')) {
                              deleteTransaction(tx.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-400 hover:text-[#E53935]"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
        <div>
          Showing {filteredTransactions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} records
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-semibold text-slate-800 dark:text-slate-200">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
