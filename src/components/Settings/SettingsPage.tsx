import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Building, 
  DollarSign, 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Moon, 
  Sun, 
  CheckCircle2, 
  AlertTriangle,
  HardDrive
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, exportDataJSON, importDataJSON, resetData, theme: appTheme, setTheme: setAppTheme } = useApp();

  const [companyName, setCompanyName] = useState(user.companyName);
  const [currency, setCurrency] = useState(user.currency);
  const [taxId, setTaxId] = useState(user.taxId || '');
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>(appTheme);

  useEffect(() => {
    setSelectedTheme(appTheme);
  }, [appTheme]);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      companyName,
      currency,
      taxId,
      theme: selectedTheme
    });

    setAppTheme(selectedTheme);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const success = await importDataJSON(content);
      if (success) {
        alert('Database restored successfully!');
      } else {
        alert('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#E53935]" />
          System Settings & Database Backup
        </h2>
        <p className="text-xs text-slate-400">Manage business preferences, currency, dark mode, and local/cloud backups</p>
      </div>

      {/* Business & Preferences Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Building className="w-4 h-4 text-blue-500" />
          Company Profile & Accounting Preferences
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Shop Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Currency Symbol</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="$">$ (USD - US Dollar)</option>
                <option value="₹">₹ (INR - Indian Rupee)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="£">£ (GBP - British Pound)</option>
                <option value="A$">A$ (AUD - Australian Dollar)</option>
                <option value="¥">¥ (JPY - Japanese Yen / CNY)</option>
                <option value="CA$">CA$ (CAD - Canadian Dollar)</option>
                <option value="AED">AED (UAE Dirham)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">GST / VAT / Tax Registration ID</label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="e.g. 22AAAAA0000A1Z5"
                className="w-full p-2.5 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">UI Theme Mode</label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="light">Light Mode (Default Premium)</option>
                <option value="dark">Dark Mode (Eye Safe)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {saveSuccess && (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-4 h-4" /> Preferences saved!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-6 py-2.5 rounded-xl bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition cursor-pointer"
            >
              Save Profile Settings
            </button>
          </div>
        </form>
      </div>

      {/* Backup & Restore Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-500" />
          Data Backup & Local Persistence
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Backup Download */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-500" /> Export Full Backup
            </div>
            <p className="text-slate-400">Download all financial transactions, categories, and settings as a JSON file.</p>
            <button
              onClick={exportDataJSON}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer"
            >
              Download Backup (.json)
            </button>
          </div>

          {/* Restore Upload */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 space-y-2">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-500" /> Restore From File
            </div>
            <p className="text-slate-400">Upload a previously exported CASH EXPENSE JSON file to restore records.</p>
            <label className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition cursor-pointer block text-center">
              Select Backup File
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-500/5 rounded-2xl border border-rose-500/20 p-6 space-y-3 text-xs">
        <h3 className="font-bold text-sm text-rose-700 dark:text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#E53935]" />
          Danger Zone
        </h3>
        <p className="text-slate-500">
          Resetting database clears all local storage transactions, audit logs, and custom categories.
        </p>

        <button
          onClick={() => {
            if (confirm('DANGER: This will permanently reset all financial records! Proceed?')) {
              resetData();
              alert('Database cleared.');
            }
          }}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition cursor-pointer"
        >
          Reset All Data To Factory Defaults
        </button>
      </div>
    </div>
  );
};
