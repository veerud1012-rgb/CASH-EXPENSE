import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Building2, 
  Smartphone, 
  Clock, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart,
  Scale
} from 'lucide-react';

export const FinancialCards: React.FC = () => {
  const { financialSummary, user } = useApp();
  const currency = user.currency || '$';

  const formatMoney = (val: number) => {
    return `${currency}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Income */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-950/50 px-2 py-1 rounded-full">
              +{financialSummary.monthlyGrowthPercent}%
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Income</p>
          <p className="text-2xl font-bold text-[#111827] dark:text-white">{formatMoney(financialSummary.totalIncome)}</p>
        </div>

        {/* Total Expense */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-lg">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-950/50 px-2 py-1 rounded-full">
              Avg/Day {formatMoney(financialSummary.averageDailyExpense)}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Expense</p>
          <p className="text-2xl font-bold text-[#111827] dark:text-white">{formatMoney(financialSummary.totalExpense)}</p>
        </div>

        {/* Net Profit */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">This Month</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Net Profit</p>
          <p className="text-2xl font-bold text-[#111827] dark:text-white">{formatMoney(financialSummary.netProfit)}</p>
        </div>

        {/* Current Balance - Featured Sleek Red Card */}
        <div className="bg-[#E53935] p-5 rounded-2xl border-none shadow-xl shadow-red-100 dark:shadow-none text-white">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-white/20 text-white rounded-lg">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-white/80 text-sm font-medium">Current Balance</p>
          <p className="text-2xl font-bold">{formatMoney(financialSummary.currentBalance)}</p>
        </div>
      </div>

      {/* Secondary Financial Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Cash in Hand */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <Wallet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Cash in Hand</span>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-slate-100">
            {formatMoney(financialSummary.cashInHand)}
          </div>
        </div>

        {/* Bank Balance */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Bank Balance</span>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-slate-100">
            {formatMoney(financialSummary.bankBalance)}
          </div>
        </div>

        {/* UPI Balance */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <Smartphone className="w-3.5 h-3.5 text-purple-500" />
            <span>UPI Balance</span>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-slate-100">
            {formatMoney(financialSummary.upiBalance)}
          </div>
        </div>

        {/* Cheque Pending */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Cheque Pending</span>
          </div>
          <div className="text-base font-bold text-amber-600 dark:text-amber-400">
            {formatMoney(financialSummary.chequePending)}
          </div>
        </div>

        {/* Today's Income / Expense */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1 lg:col-span-2 flex justify-around items-center">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Today's Income</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              +{formatMoney(financialSummary.todaysIncome)}
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Today's Expense</div>
            <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
              -{formatMoney(financialSummary.todaysExpense)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
