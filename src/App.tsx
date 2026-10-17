import { useState } from 'react';
import {
  ScreenType,
  Transaction,
  UpcomingBill,
  CategoryOutflow,
  SavingsGoal,
  RecurringSubscription,
  ConnectedAccount,
} from './types';
import {
  INITIAL_TRANSACTIONS,
  INITIAL_BILLS,
  INITIAL_OUTFLOWS,
  INITIAL_GOALS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_ACCOUNTS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardScreen } from './screens/DashboardScreen';
import { ChartsScreen } from './screens/ChartsScreen';
import { BudgetsScreen } from './screens/BudgetsScreen';
import { AiInsightsScreen } from './screens/AiInsightsScreen';
import { AddTransactionModal } from './components/AddTransactionModal';
import { TransferModal } from './components/TransferModal';
import { ScanBillModal } from './components/ScanBillModal';
import { NotificationsModal, NotificationItem } from './components/NotificationsModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');

  // Core Financial State
  const [cashTotal, setCashTotal] = useState<number>(14200.00);
  const [investedTotal, setInvestedTotal] = useState<number>(28540.00);
  const [debtTotal] = useState<number>(0.00);
  const [monthlySpent, setMonthlySpent] = useState<number>(2450.00);
  const [monthlyCap, setMonthlyCap] = useState<number>(4000.00);
  const [daysRemaining] = useState<number>(11);

  // Entities State
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [bills, setBills] = useState<UpcomingBill[]>(INITIAL_BILLS);
  const [outflows, setOutflows] = useState<CategoryOutflow[]>(INITIAL_OUTFLOWS);
  const [goals, setGoals] = useState<SavingsGoal[]>(INITIAL_GOALS);
  const [subscriptions, setSubscriptions] = useState<RecurringSubscription[]>(INITIAL_SUBSCRIPTIONS);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(INITIAL_ACCOUNTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isAuraSyncActive, setIsAuraSyncActive] = useState<boolean>(true);

  // Modals
  const [isAddSpendOpen, setIsAddSpendOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isScanBillOpen, setIsScanBillOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Computed values
  const netWorth = cashTotal + investedTotal - debtTotal;
  const safePacePerDay = Math.max(0, (monthlyCap - monthlySpent) / daysRemaining);
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Handlers
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    if (newTx.amount < 0) {
      const spendAbs = Math.abs(newTx.amount);
      setCashTotal((prev) => Math.max(0, prev - spendAbs));
      setMonthlySpent((prev) => prev + spendAbs);

      // Update outflows
      setOutflows((prev) => {
        const catIndex = prev.findIndex(
          (c) => c.name.toLowerCase() === newTx.category.toLowerCase()
        );
        if (catIndex >= 0) {
          const updated = [...prev];
          updated[catIndex] = {
            ...updated[catIndex],
            amount: updated[catIndex].amount + spendAbs,
          };
          const totalOutflow = updated.reduce((sum, item) => sum + item.amount, 0);
          return updated.map((item) => ({
            ...item,
            percentage: Math.round((item.amount / totalOutflow) * 100),
          }));
        }
        return prev;
      });
    } else {
      setCashTotal((prev) => prev + newTx.amount);
    }

    // Add alert notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: newTx.amount < 0 ? 'Outflow Logged' : 'Inflow Confirmed',
        description: `${newTx.title}: ${newTx.amount < 0 ? '-' : '+'}$${Math.abs(newTx.amount).toFixed(2)} via ${newTx.paymentMethod}`,
        time: 'Just now',
        type: newTx.amount < 0 ? 'warning' : 'success',
        icon: newTx.icon,
        read: false,
      },
      ...prev,
    ]);
  };

  const handlePayBill = (billId: string) => {
    const targetBill = bills.find((b) => b.id === billId);
    if (!targetBill || targetBill.isPaid) return;

    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, isPaid: true } : b))
    );

    handleAddTransaction({
      title: `Bill Paid: ${targetBill.title}`,
      category: 'Housing',
      paymentMethod: targetBill.accountText.includes('Visa') ? 'Visa 8820' : 'Apple Pay',
      amount: -targetBill.amount,
      dateGroup: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: targetBill.icon,
      iconBgClass: targetBill.iconBgClass,
      iconTextClass: targetBill.iconTextClass,
    });
  };

  const handleTransfer = (fromId: string, toId: string, amount: number) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromId) return { ...acc, balance: Math.max(0, acc.balance - amount) };
        if (acc.id === toId) return { ...acc, balance: acc.balance + amount };
        return acc;
      })
    );

    const fromAcc = accounts.find((a) => a.id === fromId);
    const toAcc = accounts.find((a) => a.id === toId);

    // If transferring between cash and invested
    if (fromAcc?.type === 'cash' && toAcc?.type === 'invested') {
      setCashTotal((prev) => Math.max(0, prev - amount));
      setInvestedTotal((prev) => prev + amount);
    } else if (fromAcc?.type === 'invested' && toAcc?.type === 'cash') {
      setInvestedTotal((prev) => Math.max(0, prev - amount));
      setCashTotal((prev) => prev + amount);
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Transfer Completed',
        description: `Transferred $${amount.toFixed(2)} from ${fromAcc?.name} to ${toAcc?.name}`,
        time: 'Just now',
        type: 'info',
        icon: 'swap_horiz',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleAddFundsToGoal = (goalId: string, amount: number) => {
    if (cashTotal < amount) return;
    setCashTotal((prev) => Math.max(0, prev - amount));
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      )
    );
  };

  const handleCreateGoal = (newGoalData: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...newGoalData,
      id: `goal-${Date.now()}`,
    };
    setGoals((prev) => [...prev, newGoal]);
    if (newGoal.currentAmount > 0) {
      setCashTotal((prev) => Math.max(0, prev - newGoal.currentAmount));
    }
  };

  const handleUpdateBudgetCap = (newCap: number) => {
    setMonthlyCap(newCap);
  };

  const handleTogglePauseSubscription = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, isPaused: !s.isPaused } : s))
    );
  };

  const handleApplyPromo = (subId: string, newPrice: number) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, price: newPrice, isOptimizable: false } : s))
    );
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface antialiased flex flex-col items-center">
      {/* App Shell Container */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl bg-surface min-h-screen flex flex-col relative shadow-2xl border-x border-surface-container-high/40 pb-[108px]">
        {/* Top Sticky Header */}
        <Header
          currentScreen={currentScreen}
          unreadNotificationsCount={unreadNotifications}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative w-full pt-4">
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              netWorth={netWorth}
              cashTotal={cashTotal}
              investedTotal={investedTotal}
              debtTotal={debtTotal}
              monthlySpent={monthlySpent}
              monthlyCap={monthlyCap}
              daysRemaining={daysRemaining}
              safePacePerDay={safePacePerDay}
              outflows={outflows}
              bills={bills}
              transactions={transactions}
              onOpenAddSpend={() => setIsAddSpendOpen(true)}
              onOpenTransfer={() => setIsTransferOpen(true)}
              onOpenScanBill={() => setIsScanBillOpen(true)}
              onPayBill={handlePayBill}
              onNavigateToAiInsights={() => setCurrentScreen('ai-insights')}
              onNavigateToCharts={() => setCurrentScreen('charts')}
            />
          )}

          {currentScreen === 'charts' && (
            <ChartsScreen
              netWorth={netWorth}
              cashTotal={cashTotal}
              investedTotal={investedTotal}
              outflows={outflows}
              onOpenAddSpend={() => setIsAddSpendOpen(true)}
            />
          )}

          {currentScreen === 'budgets' && (
            <BudgetsScreen
              monthlySpent={monthlySpent}
              monthlyCap={monthlyCap}
              daysRemaining={daysRemaining}
              safePacePerDay={safePacePerDay}
              goals={goals}
              onAddFundsToGoal={handleAddFundsToGoal}
              onCreateGoal={handleCreateGoal}
              onUpdateBudgetCap={handleUpdateBudgetCap}
            />
          )}

          {currentScreen === 'ai-insights' && (
            <AiInsightsScreen
              netWorth={netWorth}
              monthlySpent={monthlySpent}
              subscriptions={subscriptions}
              onTogglePauseSubscription={handleTogglePauseSubscription}
              onApplyPromo={handleApplyPromo}
            />
          )}
        </main>

        {/* Floating Bottom Navigation Bar */}
        <BottomNav
          currentScreen={currentScreen}
          onChangeScreen={setCurrentScreen}
          onOpenQuickAdd={() => setIsAddSpendOpen(true)}
        />
      </div>

      {/* Interactive Modals & Drawers */}
      <AddTransactionModal
        isOpen={isAddSpendOpen}
        onClose={() => setIsAddSpendOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        accounts={accounts}
        onTransfer={handleTransfer}
      />

      <ScanBillModal
        isOpen={isScanBillOpen}
        onClose={() => setIsScanBillOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClear={() => setNotifications([])}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        accounts={accounts}
        isAuraSyncActive={isAuraSyncActive}
        onToggleAuraSync={() => setIsAuraSyncActive(!isAuraSyncActive)}
      />
    </div>
  );
}
