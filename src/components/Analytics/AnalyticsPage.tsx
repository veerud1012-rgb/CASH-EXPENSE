import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieIcon, 
  BarChart3, 
  Activity, 
  Sparkles,
  Award
} from 'lucide-react';
import { ChartsSection } from '../Dashboard/ChartsSection';

export const AnalyticsPage: React.FC = () => {
  const { financialSummary, user, transactions } = useApp();
  const currency = user.currency || '$';

  // Health score calculation
  const savingsRate = financialSummary.totalIncome > 0 
    ? ((financialSummary.totalIncome - financialSummary.totalExpense) / financialSummary.totalIncome) * 100 
    : 0;

  let healthBadge = { text: 'Healthy', color: 'bg-emerald-100 text-emerald-800' };
  if (savingsRate < 0) healthBadge = { text: 'Deficit Warning', color: 'bg-rose-100 text-rose-800' };
  else if (savingsRate < 15) healthBadge = { text: 'Moderate', color: 'bg-amber-100 text-amber-800' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#E53935]" />
            Business Analytics & Financial Health
          </h2>
          <p className="text-xs text-slate-400">Deep-dive financial metrics, cash flow trends, and budget forecasting</p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${healthBadge.color}`}>
            <Award className="w-4 h-4" /> Financial Health: {healthBadge.text}
          </div>
        </div>
      </div>

      {/* Analytics Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold uppercase">Net Savings / Profit Margin</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {savingsRate.toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Retained profit relative to total business revenue</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold uppercase">Average Daily Cash Outflow</div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {currency}{financialSummary.averageDailyExpense.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Calculated over active accounting days</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold uppercase">Monthly Run-Rate Expense</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {currency}{financialSummary.averageMonthlyExpense.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Projected monthly operational overhead</p>
        </div>
      </div>

      {/* Charts Section */}
      <ChartsSection />
    </div>
  );
};
