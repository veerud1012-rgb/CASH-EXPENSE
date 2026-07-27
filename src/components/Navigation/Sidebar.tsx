import React from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Receipt, 
  Scan, 
  Images, 
  BarChart3, 
  FolderKanban, 
  ShieldCheck, 
  Settings, 
  Plus, 
  Sparkles,
  DollarSign
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsTransactionModalOpen, 
    setEditingTransaction,
    setIsOCRModalOpen,
    user 
  } = useApp();

  const navItems: Array<{ id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: string; adminOnly?: boolean }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'ocr_scan', label: 'AI Receipt Scanner', icon: Scan, badge: 'AI' },
    { id: 'gallery', label: 'Receipt Gallery', icon: Images },
    { id: 'reports', label: 'Financial Reports', icon: BarChart3 },
    { id: 'categories', label: 'Categories', icon: FolderKanban },
    { id: 'audit_logs', label: 'Audit & System Logs', icon: ShieldCheck, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleOpenNewTx = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 shrink-0 z-40 transition-colors">
      {/* Brand Logo Header */}
      <div className="p-6 flex items-center justify-between border-b border-[#E5E7EB] dark:border-slate-800">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 bg-[#E53935] rounded-xl flex items-center justify-center shadow-lg shadow-red-200 dark:shadow-none text-white font-black text-xl">
            <DollarSign className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight text-[#111827] dark:text-white">
              CASH<span className="text-[#E53935]">EXPENSE</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Financial Platform</div>
          </div>
        </div>
      </div>

      {/* Quick Action CTAs */}
      <div className="px-4 pt-4 space-y-2">
        <button
          onClick={handleOpenNewTx}
          className="w-full py-2.5 px-4 bg-[#E53935] hover:bg-red-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 shadow-md shadow-red-100 dark:shadow-none transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Transaction</span>
        </button>

        <button
          onClick={() => setIsOCRModalOpen(true)}
          className="w-full py-2 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-[#E53935] font-semibold text-xs rounded-lg flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
        >
          <Scan className="w-4 h-4 text-[#E53935]" />
          <span>Smart OCR Upload</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        </button>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
        <div className="px-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          Menu
        </div>

        {navItems.map((item) => {
          if (item.adminOnly && user.role !== 'admin') return null;

          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'ocr_scan') {
                  setIsOCRModalOpen(true);
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs transition-colors cursor-pointer ${
                isActive
                  ? 'bg-red-50 dark:bg-red-950/40 text-[#E53935] font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#E53935]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-[#E53935] text-white rounded-full uppercase tracking-widest">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-6 mt-auto border-t border-[#E5E7EB] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center font-bold text-slate-600 dark:text-slate-200 text-xs shrink-0">
            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{user.companyName}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
