import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category, TransactionType } from '../../types';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  Tag, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  Zap, 
  Wifi, 
  Users, 
  Home, 
  Wrench, 
  Utensils, 
  Megaphone, 
  Car, 
  Fuel, 
  FileText, 
  PenTool, 
  MoreHorizontal,
  X,
  Check
} from 'lucide-react';

const ICON_LIST = [
  'Building2', 'Zap', 'Wifi', 'Users', 'Home', 'Wrench', 
  'Utensils', 'Megaphone', 'Car', 'Fuel', 'FileText', 'PenTool', 
  'TrendingUp', 'PiggyBank', 'Briefcase', 'Percent', 'Tag'
];

const COLOR_LIST = [
  '#E53935', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#14B8A6', '#6366F1', '#D97706'
];

export const CategoryManager: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useApp();
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('Tag');
  const [color, setColor] = useState('#E53935');
  const [budgetLimit, setBudgetLimit] = useState('');

  const filteredCategories = categories.filter(c => c.type === activeTab);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addCategory({
      name,
      type: activeTab,
      iconName,
      color,
      budgetLimit: budgetLimit ? parseFloat(budgetLimit) : undefined
    });

    setName('');
    setBudgetLimit('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#E53935]" />
            Category Management
          </h2>
          <p className="text-xs text-slate-400">Configure default and custom income & expense categories</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-500/20 active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Custom Category</span>
        </button>
      </div>

      {/* Income / Expense Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('expense')}
          className={`pb-3 font-extrabold text-xs flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'expense' ? 'border-[#E53935] text-[#E53935]' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Expense Categories ({categories.filter(c => c.type === 'expense').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('income')}
          className={`pb-3 font-extrabold text-xs flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'income' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Income Categories ({categories.filter(c => c.type === 'income').length})</span>
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCategories.map(cat => (
          <div
            key={cat.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-md"
                style={{ backgroundColor: cat.color }}
              >
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{cat.name}</div>
                <div className="text-[10px] text-slate-400 capitalize">{cat.isCustom ? 'Custom Category' : 'Default System Category'}</div>
              </div>
            </div>

            {cat.isCustom && (
              <button
                onClick={() => {
                  if (confirm(`Delete category '${cat.name}'?`)) {
                    deleteCategory(cat.id);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#E53935] hover:bg-rose-50 dark:hover:bg-rose-950 transition opacity-0 group-hover:opacity-100"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Custom Category Creator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Create Custom Category</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Software Subscriptions"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Color Accent</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_LIST.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition flex items-center justify-center ${color === c ? 'ring-2 ring-slate-900 dark:ring-white scale-110' : ''}`}
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <Check className="w-3 h-3 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E53935] hover:bg-red-700 text-white font-bold shadow-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
