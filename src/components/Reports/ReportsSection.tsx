import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  FileText, 
  FileSpreadsheet, 
  Building, 
  Tag, 
  CreditCard,
  DollarSign
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ReportsSection: React.FC = () => {
  const { transactions, categories, user } = useApp();
  const [reportType, setReportType] = useState<'monthly' | 'weekly' | 'yearly' | 'custom' | 'gst'>('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const currency = user.currency || '$';

  // Filter transactions based on selected report period
  const reportTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (reportType === 'monthly' || reportType === 'gst') {
        return t.date.startsWith(selectedMonth);
      } else if (reportType === 'weekly') {
        const d = new Date(t.date);
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
        return d >= sevenDaysAgo;
      } else if (reportType === 'yearly') {
        return t.date.startsWith(selectedMonth.substring(0, 4));
      } else if (reportType === 'custom') {
        if (startDate && t.date < startDate) return false;
        if (endDate && t.date > endDate) return false;
        return true;
      }
      return true;
    });
  }, [transactions, reportType, selectedMonth, startDate, endDate]);

  const reportTotals = useMemo(() => {
    let income = 0;
    let expense = 0;
    let gstTaxTotal = 0;

    reportTransactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      if (t.type === 'expense') expense += t.amount;
      if (t.ocrData?.taxAmount) gstTaxTotal += t.ocrData.taxAmount;
    });

    return {
      income,
      expense,
      profit: income - expense,
      gstTaxTotal
    };
  }, [reportTransactions]);

  const exportPDFReport = () => {
    const doc = new jsPDF();

    // Company Header Banner
    doc.setFillColor(229, 57, 53); // #E53935 Red Accent
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('CASH EXPENSE', 14, 18);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Official Financial Statement & Cash Flow Report', 14, 25);

    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 145, 18);
    doc.text(`Company: ${user.companyName}`, 145, 24);

    // Summary Box
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Financial Period Summary:', 14, 40);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Income: ${currency}${reportTotals.income.toLocaleString()}`, 14, 47);
    doc.text(`Total Expense: ${currency}${reportTotals.expense.toLocaleString()}`, 70, 47);
    doc.text(`Net Profit: ${currency}${reportTotals.profit.toLocaleString()}`, 130, 47);
    doc.text(`Estimated GST/Tax: ${currency}${reportTotals.gstTaxTotal.toLocaleString()}`, 14, 53);

    // Transactions Table
    const tableRows = reportTransactions.map(t => [
      t.date,
      t.title,
      t.category,
      t.paymentType,
      t.vendorOrCustomer,
      t.type.toUpperCase(),
      `${currency}${t.amount.toLocaleString()}`
    ]);

    (doc as any).autoTable({
      startY: 60,
      head: [['Date', 'Title', 'Category', 'Payment Method', 'Vendor/Customer', 'Type', 'Amount']],
      body: tableRows,
      headStyles: { fillColor: [229, 57, 53] },
      styles: { fontSize: 8 }
    });

    doc.save(`CASH_EXPENSE_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportExcelReport = () => {
    const data = reportTransactions.map(t => ({
      Date: t.date,
      Title: t.title,
      Type: t.type,
      Amount: t.amount,
      Category: t.category,
      PaymentMethod: t.paymentType,
      VendorOrCustomer: t.vendorOrCustomer,
      ReferenceNumber: t.referenceNumber || '',
      Notes: t.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Financial Report');
    XLSX.writeFile(workbook, `cash_expense_report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#E53935]" />
            Financial Reports & GST Statements
          </h2>
          <p className="text-xs text-slate-400">Generate executive financial reports for tax filing, audits, and company reviews</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Report Type Selector */}
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="monthly">Monthly Report</option>
            <option value="weekly">Weekly Report</option>
            <option value="yearly">Yearly Report</option>
            <option value="gst">GST / Tax Report</option>
            <option value="custom">Custom Date Range</option>
          </select>

          {reportType === 'monthly' || reportType === 'gst' ? (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
            />
          ) : reportType === 'custom' ? (
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          ) : null}

          {/* Export Actions */}
          <button
            onClick={exportPDFReport}
            className="px-3.5 py-2 rounded-xl bg-[#E53935] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-500/20 cursor-pointer transition"
          >
            <FileText className="w-4 h-4" /> Export PDF
          </button>

          <button
            onClick={exportExcelReport}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer transition"
          >
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition cursor-pointer"
            title="Print Statement"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards for Report */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
          <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase">Period Income</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {currency}{reportTotals.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50">
          <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase">Period Expense</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {currency}{reportTotals.expense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase">Net Statement Profit</div>
          <div className={`text-2xl font-black mt-1 ${reportTotals.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {currency}{reportTotals.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
          <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">Est. Tax / GST Total</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {currency}{reportTotals.gstTaxTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Statement Line Items ({reportTransactions.length} Records)
          </h3>
          <span className="text-xs text-slate-400 font-mono">{user.companyName}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-500 dark:text-slate-400 uppercase">
                <th className="p-3">Date</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Payment Type</th>
                <th className="p-3">Vendor / Client</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {reportTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No transactions found for this report period.
                  </td>
                </tr>
              ) : (
                reportTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono">{t.date}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{t.title}</td>
                    <td className="p-3">{t.category}</td>
                    <td className="p-3">{t.paymentType}</td>
                    <td className="p-3">{t.vendorOrCustomer}</td>
                    <td className={`p-3 text-right font-extrabold font-mono ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{currency}{t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
