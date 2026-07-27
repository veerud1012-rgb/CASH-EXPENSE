import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Plus, 
  Scan, 
  Bell, 
  Sun, 
  Moon, 
  Shield, 
  User, 
  LogOut, 
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    user, 
    filterState, 
    setFilterState, 
    setActiveTab, 
    notifications, 
    setIsTransactionModalOpen, 
    setEditingTransaction,
    setIsOCRModalOpen,
    theme,
    setTheme,
    setIsLoggedIn
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const handleOpenNewTx = () => {
    setEditingTransaction(null);
    setIsTransactionModalOpen(true);
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-[#E5E7EB] dark:border-slate-800 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Page Title / Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <h1 className="text-lg font-bold text-[#111827] dark:text-white hidden sm:block shrink-0">
          Financial Overview
        </h1>
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filterState.searchQuery}
            onChange={(e) => {
              setFilterState(prev => ({ ...prev, searchQuery: e.target.value }));
              if (e.target.value && location.pathname !== '/transactions') {
                setActiveTab('transactions');
              }
            }}
            placeholder="Search transactions, vendors, amounts..."
            className="w-full pl-9 pr-4 py-1.5 text-xs md:text-sm bg-[#F8F9FA] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E53935] text-[#1F2937] dark:text-slate-100 placeholder-slate-400 transition"
          />
        </div>
      </div>

      {/* Action Buttons & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Add Transaction Button */}
        <button
          onClick={handleOpenNewTx}
          className="flex items-center gap-2 bg-[#E53935] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition-all shadow-md shadow-red-100 dark:shadow-none cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E53935] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center font-semibold text-slate-900 dark:text-slate-100">
                <span>Notifications</span>
                <span className="text-[10px] bg-red-100 dark:bg-red-900/50 text-[#E53935] px-2 py-0.5 rounded-full font-mono">
                  {notifications.length} New
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">No new alerts</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5">{n.title}</div>
                      <div className="text-slate-500 dark:text-slate-400 leading-snug">{n.message}</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">{n.timestamp}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifMenu(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700/60 cursor-pointer"
          >
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user.name}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-red-500/20"
            />
            <div className="hidden lg:block text-left text-xs pr-1">
              <div className="font-semibold text-slate-900 dark:text-slate-100 leading-none">{user.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 capitalize">{user.role}</div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</div>
                <div className="text-slate-400 truncate mt-0.5">{user.email}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">{user.companyName}</div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Profile & Settings</span>
              </button>

              {user.role === 'admin' && (
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-red-500" />
                  <span>Admin Panel & Audit Logs</span>
                </button>
              )}

              <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 text-[#E53935] font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-[#E53935]" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
