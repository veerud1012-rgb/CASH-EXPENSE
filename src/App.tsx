import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Navigation/Header';
import { Sidebar } from './components/Navigation/Sidebar';
import { MobileNav } from './components/Navigation/MobileNav';
import { FinancialCards } from './components/Dashboard/FinancialCards';
import { ChartsSection } from './components/Dashboard/ChartsSection';
import { RecentTransactionsOverview } from './components/Dashboard/RecentTransactionsOverview';
import { TransactionList } from './components/Transactions/TransactionList';
import { TransactionModal } from './components/Transactions/TransactionModal';
import { TransactionDetailsModal } from './components/Transactions/TransactionDetailsModal';
import { ReceiptUploadModal } from './components/OCR/ReceiptUploadModal';
import { ReceiptGallery } from './components/Gallery/ReceiptGallery';
import { ReportsSection } from './components/Reports/ReportsSection';
import { CategoryManager } from './components/Categories/CategoryManager';
import { AnalyticsPage } from './components/Analytics/AnalyticsPage';
import { SettingsPage } from './components/Settings/SettingsPage';
import { NotificationToast } from './components/Common/NotificationToast';
import { Transaction } from './types';
import { Plus, Scan, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    setIsTransactionModalOpen, 
    setIsOCRModalOpen, 
    setEditingTransaction,
    deleteTransaction 
  } = useApp();

  const [selectedTransactionForView, setSelectedTransactionForView] = useState<Transaction | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-slate-950 text-[#1F2937] dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notifications */}
      <NotificationToast />

      {/* Top Fixed Header */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 pb-24 md:pb-12 max-w-7xl mx-auto w-full">
          {/* Active Tab View Switching */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Top Title & Header Actions Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 shadow-sm">
                <div>
                  <h1 className="text-xl md:text-2xl font-extrabold text-[#111827] dark:text-white flex items-center gap-2">
                    Financial Overview
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time tracking of cash flows, expenses, and automated receipt OCR</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setIsOCRModalOpen(true)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Scan className="w-4 h-4 text-[#E53935]" />
                    <span>Scan Receipt</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  </button>

                  <button
                    onClick={() => {
                      setEditingTransaction(null);
                      setIsTransactionModalOpen(true);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[#E53935] hover:bg-red-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-100 dark:shadow-none active:scale-95 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Transaction</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <FinancialCards />

              {/* Recharts Graphical Visualizations */}
              <ChartsSection />

              {/* Recent Transactions List */}
              <RecentTransactionsOverview
                onViewDetails={(tx) => setSelectedTransactionForView(tx)}
              />
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div>
                  <h1 className="text-xl font-black text-slate-900 dark:text-white">Transaction Management</h1>
                  <p className="text-xs text-slate-400">Search, filter, edit, and export complete financial records</p>
                </div>

                <button
                  onClick={() => {
                    setEditingTransaction(null);
                    setIsTransactionModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-500/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>New Transaction</span>
                </button>
              </div>

              <TransactionList
                onSelectTransaction={(tx) => setSelectedTransactionForView(tx)}
              />
            </div>
          )}

          {activeTab === 'receipts' && (
            <div className="animate-in fade-in duration-150">
              <ReceiptGallery />
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="animate-in fade-in duration-150">
              <ReportsSection />
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="animate-in fade-in duration-150">
              <CategoryManager />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="animate-in fade-in duration-150">
              <AnalyticsPage />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-150">
              <SettingsPage />
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-20 right-4 md:hidden z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsOCRModalOpen(true)}
          className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-2xl border border-slate-700"
          title="Scan Receipt OCR"
        >
          <Scan className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            setEditingTransaction(null);
            setIsTransactionModalOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-[#E53935] text-white flex items-center justify-center shadow-2xl shadow-red-500/50"
          title="New Transaction"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Modals & Drawers */}
      <TransactionModal />
      <ReceiptUploadModal />
      <TransactionDetailsModal
        transaction={selectedTransactionForView}
        onClose={() => setSelectedTransactionForView(null)}
        onEdit={(tx) => {
          setSelectedTransactionForView(null);
          setEditingTransaction(tx);
          setIsTransactionModalOpen(true);
        }}
        onDelete={(id) => {
          deleteTransaction(id);
          setSelectedTransactionForView(null);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
