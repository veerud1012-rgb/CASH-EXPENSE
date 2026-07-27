import { Category, Transaction, UserProfile, AuditLog } from '../types';

export const DEFAULT_USER: UserProfile = {
  id: 'usr_001',
  name: 'Alex Vance',
  email: 'alex@cashexpense.app',
  role: 'admin',
  companyName: 'Apex Digital Solutions',
  currency: '$',
  dateFormat: 'YYYY-MM-DD',
  theme: 'system',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  notificationsEnabled: true,
  largeExpenseThreshold: 500
};

export const DEFAULT_CATEGORIES: Category[] = [
  // Income Categories
  { id: 'cat_inc_1', name: 'Sales', type: 'income', iconName: 'TrendingUp', color: '#10B981' },
  { id: 'cat_inc_2', name: 'Investment', type: 'income', iconName: 'PiggyBank', color: '#3B82F6' },
  { id: 'cat_inc_3', name: 'Salary', type: 'income', iconName: 'Briefcase', color: '#8B5CF6' },
  { id: 'cat_inc_4', name: 'Commission', type: 'income', iconName: 'Percent', color: '#EC4899' },
  { id: 'cat_inc_5', name: 'Refund', type: 'income', iconName: 'RotateCcw', color: '#14B8A6' },
  { id: 'cat_inc_6', name: 'Interest', type: 'income', iconName: 'Landmark', color: '#F59E0B' },
  { id: 'cat_inc_7', name: 'Other Income', type: 'income', iconName: 'PlusCircle', color: '#6B7280' },

  // Expense Categories
  { id: 'cat_exp_1', name: 'Office Expense', type: 'expense', iconName: 'Building2', color: '#E53935' },
  { id: 'cat_exp_2', name: 'Travel', type: 'expense', iconName: 'Plane', color: '#3B82F6' },
  { id: 'cat_exp_3', name: 'Electricity', type: 'expense', iconName: 'Zap', color: '#F59E0B' },
  { id: 'cat_exp_4', name: 'Internet', type: 'expense', iconName: 'Wifi', color: '#6366F1' },
  { id: 'cat_exp_5', name: 'Salary Paid', type: 'expense', iconName: 'Users', color: '#8B5CF6' },
  { id: 'cat_exp_6', name: 'Rent', type: 'expense', iconName: 'Home', color: '#EF4444' },
  { id: 'cat_exp_7', name: 'Maintenance', type: 'expense', iconName: 'Wrench', color: '#14B8A6' },
  { id: 'cat_exp_8', name: 'Food', type: 'expense', iconName: 'Utensils', color: '#F97316' },
  { id: 'cat_exp_9', name: 'Marketing', type: 'expense', iconName: 'Megaphone', color: '#EC4899' },
  { id: 'cat_exp_10', name: 'Transport', type: 'expense', iconName: 'Car', color: '#06B6D4' },
  { id: 'cat_exp_11', name: 'Fuel', type: 'expense', iconName: 'Fuel', color: '#D97706' },
  { id: 'cat_exp_12', name: 'Tax', type: 'expense', iconName: 'FileText', color: '#64748B' },
  { id: 'cat_exp_13', name: 'Stationery', type: 'expense', iconName: 'PenTool', color: '#10B981' },
  { id: 'cat_exp_14', name: 'Miscellaneous', type: 'expense', iconName: 'MoreHorizontal', color: '#9CA3AF' }
];

const todayStr = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
const fiveDaysAgo = new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0];
const tenDaysAgo = new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_1',
    timestamp: new Date().toISOString(),
    user: 'Alex Vance',
    action: 'LOGIN',
    module: 'AUTH',
    details: 'User authenticated successfully via Web App'
  },
  {
    id: 'log_2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: 'Alex Vance',
    action: 'OCR_UPLOAD',
    module: 'RECEIPTS',
    details: 'Uploaded receipt comcast_july_bill.jpg and auto-extracted $129.99'
  },
  {
    id: 'log_3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    user: 'Alex Vance',
    action: 'CREATE_TRANSACTION',
    module: 'TRANSACTIONS',
    details: 'Added income of $3,450.00 from Acme Global Corp'
  }
];
