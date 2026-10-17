export type ScreenType = 'dashboard' | 'charts' | 'budgets' | 'ai-insights';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  paymentMethod: string;
  amount: number; // negative for expense, positive for income
  dateGroup: 'Today' | 'Yesterday' | 'Earlier';
  time: string;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
}

export interface UpcomingBill {
  id: string;
  title: string;
  dueText: string;
  accountText: string;
  amount: number;
  isAutoPay: boolean;
  isPaid: boolean;
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
}

export interface CategoryOutflow {
  name: string;
  percentage: number;
  amount: number;
  colorClass: string;
  dotColorClass: string;
  icon: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  targetDate: string;
  paceNote: string;
  icon: string;
  color: string;
}

export interface RecurringSubscription {
  id: string;
  name: string;
  price: number;
  cycle: 'monthly' | 'yearly';
  renewalDate: string;
  category: string;
  isOptimizable: boolean;
  savingsOpportunity?: string;
  isPaused: boolean;
  icon: string;
}

export interface ConnectedAccount {
  id: string;
  name: string;
  type: 'cash' | 'invested' | 'debt';
  institution: string;
  accountNumberMask: string;
  balance: number;
  apy?: string;
  lastSynced: string;
}
