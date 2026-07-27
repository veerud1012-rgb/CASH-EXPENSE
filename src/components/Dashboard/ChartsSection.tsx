import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  Legend 
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, CreditCard, Upload } from 'lucide-react';

const CATEGORY_COLORS = [
  '#E53935', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#14B8A6', '#6366F1', '#D97706'
];

export const ChartsSection: React.FC = () => {
  const { transactions, user, setIsOCRModalOpen } = useApp();
  const currency = user.currency || '$';

  // 1. Monthly Income vs Expense Data
  const monthlyData = useMemo(() => {
    const monthsMap: { [key: string]: { month: string; income: number; expense: number; profit: number } } = {};
    
    // Last 6 months initialization
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().substring(0, 7);
      const monthLabel = d.toLocaleString('en-US', { month: 'short' });
      monthsMap[key] = { month: monthLabel, income: 0, expense: 0, profit: 0 };
    }

    transactions.forEach(t => {
      const key = t.date.substring(0, 7);
      if (monthsMap[key]) {
        if (t.type === 'income') monthsMap[key].income += t.amount;
        if (t.type === 'expense') monthsMap[key].expense += t.amount;
        monthsMap[key].profit = monthsMap[key].income - monthsMap[key].expense;
      }
    });

    return Object.values(monthsMap);
  }, [transactions]);

  // 2. Category Breakdown Data
  const categoryData = useMemo(() => {
    const catMap: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      });

    return Object.keys(catMap).map((catName, index) => ({
      name: catName,
      value: catMap[catName],
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
    })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [transactions]);

  // 3. Payment Method Distribution Data
  const paymentMethodData = useMemo(() => {
    const methodMap: { [key: string]: number } = {};
    transactions.forEach(t => {
      methodMap[t.paymentType] = (methodMap[t.paymentType] || 0) + t.amount;
    });

    return Object.keys(methodMap).map((mName, index) => ({
      name: mName,
      amount: methodMap[mName],
      color: CATEGORY_COLORS[(index + 3) % CATEGORY_COLORS.length]
    })).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // 4. Weekly Cash Flow Analytics Data
  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekMap: { [key: string]: { day: string; income: number; expense: number } } = {};
    
    // Initialize 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];
      weekMap[dateStr] = { day: dayName, income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      if (weekMap[t.date]) {
        if (t.type === 'income') weekMap[t.date].income += t.amount;
        if (t.type === 'expense') weekMap[t.date].expense += t.amount;
      }
    });

    return Object.values(weekMap);
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs text-white">
          <div className="font-bold border-b border-slate-800 pb-1 mb-1">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-4 py-0.5" style={{ color: entry.color }}>
              <span className="capitalize">{entry.name}:</span>
              <span className="font-mono font-bold">{currency}{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Mid Section: Cash Flow Trends & Smart OCR Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Cash Flow Trends</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-xs font-bold rounded bg-[#E53935] text-white">Monthly</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#E53935" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Smart OCR Upload Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-dashed border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm border border-red-100 dark:border-red-900/40 mb-4 text-[#E53935]">
            <Upload className="w-7 h-7" />
          </div>
          <h4 className="font-bold text-[#111827] dark:text-white mb-1">Smart OCR Upload</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 px-4">Upload or drag & drop receipts. AI will extract merchant, date & amount automatically.</p>
          <button
            onClick={() => setIsOCRModalOpen(true)}
            className="text-xs font-bold text-[#E53935] border border-[#E53935] px-4 py-2 rounded-lg hover:bg-[#E53935] hover:text-white transition-all cursor-pointer"
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* Analytics Grid: Weekly Flow, Categories, Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 2. Weekly Cash Flow Analytics Area Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Weekly Cash Flow</h4>
                <p className="text-[11px] text-slate-400">Daily flow over past 7 days</p>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E53935" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#E53935" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="day" tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" fillOpacity={1} fill="url(#incomeGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" name="Expense" stroke="#E53935" fillOpacity={1} fill="url(#expenseGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Category Expense Breakdown Donut Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Expense Categories</h4>
                <p className="text-[11px] text-slate-400">Share of total operational costs</p>
              </div>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            {categoryData.length === 0 ? (
              <div className="text-slate-400 text-xs">No expense category data found</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => [`${currency}${val.toLocaleString()}`, 'Expense']} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 4. Payment Method Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-500 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Payment Methods</h4>
                <p className="text-[11px] text-slate-400">Cash, UPI, Bank & Credit Card</p>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={paymentMethodData} margin={{ top: 5, right: 15, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                <XAxis type="number" tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis type="category" dataKey="name" tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} width={80} />
                <Tooltip formatter={(val: number) => [`${currency}${val.toLocaleString()}`, 'Volume']} />
                <Bar dataKey="amount" name="Volume" fill="#6366F1" radius={[0, 4, 4, 0]}>
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-pm-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
