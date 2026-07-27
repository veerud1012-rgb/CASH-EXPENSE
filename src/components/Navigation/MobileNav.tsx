import React, { useState } from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Receipt, 
  Scan, 
  Images, 
  BarChart3, 
  Menu, 
  X, 
  Plus, 
  FolderKanban, 
  Settings, 
  ShieldCheck,
  DollarSign
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsTransactionModalOpen, 
    setEditingTransaction,
    setIsOCRModalOpen,
    user 
  } = useApp();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const mainTabs: Array<{ id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Cash Flow', icon: Receipt },
    { id: 'gallery', label: 'Receipts', icon: Images },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  const handleOpenNewTx = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  return (
    <>
      {/* Mobile Bottom Fixed Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-40 px-2 flex items-center justify-around shadow-2xl">
        {mainTabs.slice(0, 2).map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition ${
                isActive ? 'text-[#E53935] font-bold' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* Center Floating Action Button for Scan / Add */}
        <div className="relative -top-5 flex items-center gap-1">
          <button
            onClick={() => setIsOCRModalOpen(true)}
            className="w-12 h-12 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/30 active:scale-95 transition"
            title="Scan Receipt OCR"
          >
            <Scan className="w-5 h-5 text-rose-500" />
          </button>
          <button
            onClick={handleOpenNewTx}
            className="w-12 h-12 rounded-full bg-[#E53935] text-white flex items-center justify-center shadow-lg shadow-red-500/40 active:scale-95 transition"
            title="Add Cash Transaction"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {mainTabs.slice(2, 4).map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition ${
                isActive ? 'text-[#E53935] font-bold' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* More Drawer Menu Toggle */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </div>

      {/* Mobile Navigation Slide-Over Drawer */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E53935] text-white flex items-center justify-center font-black">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">CASH EXPENSE</span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <button
                  onClick={() => { setActiveTab('dashboard'); setIsDrawerOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl font-semibold ${activeTab === 'dashboard' ? 'bg-red-50 text-[#E53935]' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => { setActiveTab('transactions'); setIsDrawerOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl font-semibold ${activeTab === 'transactions' ? 'bg-red-50 text-[#E53935]' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  <Receipt className="w-4 h-4" />
                  <span>Transactions</span>
                </button>

                <button
                  onClick={() => { setIsOCRModalOpen(true); setIsDrawerOpen(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/30"
                >
                  <Scan className="w-4 h-4 text-[#E53935]" />
                  <span>AI OCR Scanner</span>
                </button>

                <button
                  onClick={() => { setActiveTab('gallery'); setIsDrawerOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl font-semibold ${activeTab === 'gallery' ? 'bg-red-50 text-[#E53935]' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  <Images className="w-4 h-4" />
                  <span>Receipt Gallery</span>
                </button>

                <button
                  onClick={() => { setActiveTab('reports'); setIsDrawerOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl font-semibold ${activeTab === 'reports' ? 'bg-red-50 text-[#E53935]' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Reports & Analytics</span>
                </button>

                <button
                  onClick={() => { setActiveTab('categories'); setIsDrawerOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl font-semibold ${activeTab === 'categories' ? 'bg-red-50 text-[#E53935]' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  <FolderKanban className="w-4 h-4" />
                  <span>Manage Categories</span>
                </button>

                {user.role === 'admin' && (
                  <button
                    onClick={() => { setActiveTab('audit_logs'); setIsDrawerOpen(false); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl font-semibold ${activeTab === 'audit_logs' ? 'bg-red-50 text-[#E53935]' : 'text-slate-600 dark:text-slate-300'}`}
                  >
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                    <span>Audit & System Logs</span>
                  </button>
                )}

                <button
                  onClick={() => { setActiveTab('settings'); setIsDrawerOpen(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl font-semibold ${activeTab === 'settings' ? 'bg-red-50 text-[#E53935]' : 'text-slate-600 dark:text-slate-300'}`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings & Backup</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              <div className="font-semibold text-slate-700 dark:text-slate-300">{user.name}</div>
              <div>{user.companyName}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
