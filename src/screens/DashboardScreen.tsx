import React, { useState } from 'react';
import { Transaction, UpcomingBill, CategoryOutflow } from '../types';

interface DashboardScreenProps {
  netWorth: number;
  cashTotal: number;
  investedTotal: number;
  debtTotal: number;
  monthlySpent: number;
  monthlyCap: number;
  daysRemaining: number;
  safePacePerDay: number;
  outflows: CategoryOutflow[];
  bills: UpcomingBill[];
  transactions: Transaction[];
  onOpenAddSpend: () => void;
  onOpenTransfer: () => void;
  onOpenScanBill: () => void;
  onPayBill: (billId: string) => void;
  onNavigateToAiInsights: () => void;
  onNavigateToCharts: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  netWorth,
  cashTotal,
  investedTotal,
  debtTotal,
  monthlySpent,
  monthlyCap,
  daysRemaining,
  safePacePerDay,
  outflows,
  bills,
  transactions,
  onOpenAddSpend,
  onOpenTransfer,
  onOpenScanBill,
  onPayBill,
  onNavigateToAiInsights,
  onNavigateToCharts,
}) => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('All');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const budgetPercentage = Math.min(100, Math.round((monthlySpent / monthlyCap) * 100));

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (selectedFilterCategory === 'All') return true;
    return tx.category.toLowerCase().includes(selectedFilterCategory.toLowerCase());
  });

  const todayTransactions = filteredTransactions.filter((tx) => tx.dateGroup === 'Today');
  const yesterdayTransactions = filteredTransactions.filter(
    (tx) => tx.dateGroup === 'Yesterday' || tx.dateGroup === 'Earlier'
  );

  return (
    <div className="flex flex-col w-full px-margin space-y-space-lg pb-10">
      {/* Net Worth & Overview Card */}
      <div className="relative w-full rounded-3xl bg-surface-container-lowest p-space-lg shadow-xl overflow-hidden mt-space-sm border border-surface-container-high/40">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-gradient-to-br from-secondary-fixed/40 via-primary-fixed/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col space-y-space-md">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                Total Net Worth
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsBalanceHidden(!isBalanceHidden)}
              aria-label="Toggle balance visibility"
              className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isBalanceHidden ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>

          {/* Main Net Worth Value & Badge */}
          <div className="flex flex-col space-y-space-xs">
            <div className="flex items-baseline gap-space-sm flex-wrap">
              <h2 className="font-numeric-hero text-numeric-hero text-on-surface tracking-tight">
                {isBalanceHidden
                  ? '••••••••'
                  : `$${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </h2>
              <div className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-primary-fixed/60 text-on-primary-fixed">
                <span className="material-symbols-outlined text-[16px] text-primary">arrow_upward</span>
                <span className="font-label-md text-label-md text-primary font-semibold">+$2,840 (5.8%)</span>
              </div>
            </div>
            <span className="font-body-sm text-body-sm text-outline">
              Updated 2 minutes ago via Aura Sync
            </span>
          </div>

          {/* Quick Breakdown Chips */}
          <div className="grid grid-cols-3 gap-space-xs pt-space-xs">
            <div className="flex flex-col p-space-sm rounded-xl bg-surface-container-low">
              <span className="font-label-sm text-label-sm text-outline">Cash</span>
              <span className="font-headline-md text-headline-md text-on-surface mt-0.5">
                {isBalanceHidden ? '•••' : `$${cashTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              </span>
              <span className="font-body-sm text-body-sm text-primary mt-0.5">3 accounts</span>
            </div>

            <div className="flex flex-col p-space-sm rounded-xl bg-surface-container-low">
              <span className="font-label-sm text-outline">Invested</span>
              <span className="font-headline-md text-headline-md text-on-surface mt-0.5">
                {isBalanceHidden ? '•••' : `$${investedTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              </span>
              <span className="font-body-sm text-body-sm text-primary mt-0.5">+8.4% APY</span>
            </div>

            <div className="flex flex-col p-space-sm rounded-xl bg-surface-container-low">
              <span className="font-label-sm text-label-sm text-outline">Debt</span>
              <span className="font-headline-md text-headline-md text-on-surface mt-0.5">
                {isBalanceHidden ? '•••' : `$${debtTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </span>
              <span className="font-body-sm text-body-sm text-secondary mt-0.5">Zero debt ✨</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-space-xs pt-space-xs">
            <button
              type="button"
              onClick={onOpenAddSpend}
              className="flex flex-col items-center justify-center p-space-sm rounded-2xl bg-primary text-on-primary shadow-sm hover:opacity-95 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px] mb-0.5">add_circle</span>
              <span className="font-label-md text-label-md font-semibold text-on-primary">Add Spend</span>
            </button>

            <button
              type="button"
              onClick={onOpenTransfer}
              className="flex flex-col items-center justify-center p-space-sm rounded-2xl bg-surface-container text-on-surface hover:bg-surface-container-high active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px] text-primary mb-0.5">send</span>
              <span className="font-label-md text-label-md font-semibold text-on-surface">Transfer</span>
            </button>

            <button
              type="button"
              onClick={onOpenScanBill}
              className="flex flex-col items-center justify-center p-space-sm rounded-2xl bg-surface-container text-on-surface hover:bg-surface-container-high active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px] text-secondary mb-0.5">
                document_scanner
              </span>
              <span className="font-label-md text-label-md font-semibold text-on-surface">Scan Bill</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Financial Assistant Pulse */}
      <div className="relative w-full rounded-3xl p-space-md bg-surface-container-lowest shadow-lg overflow-hidden border border-surface-container-high/40">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-secondary-container/30 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col space-y-space-sm">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[16px] text-secondary animate-spin" style={{ animationDuration: '6s' }}>
                auto_awesome
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-wide font-bold">
                Aura AI Pulse
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-primary font-semibold">Live Projection</span>
          </div>

          <div className="flex gap-space-sm items-start">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed/50 flex-shrink-0 flex items-center justify-center text-primary mt-0.5">
              <span className="material-symbols-outlined text-[22px]">flight_takeoff</span>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="font-body-md text-body-md text-on-surface leading-snug">
                You spent <span className="font-semibold text-primary">18% less on Dining</span> this week. At this pace, your <span className="font-semibold text-on-surface">Bali Vacation ($5k)</span> hits funding <span className="font-semibold text-primary">12 days early</span>!
              </p>
              <button
                type="button"
                onClick={onNavigateToAiInsights}
                className="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-md text-label-md font-semibold pt-1 transition-colors self-start"
              >
                <span>Optimize recurring subscriptions</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Budget Snapshot */}
      <div className="w-full rounded-3xl p-space-lg bg-surface-container-lowest shadow-sm flex flex-col space-y-space-md border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              April Spending Limit
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Monthly Budget</h3>
          </div>
          <div className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md font-semibold">
            {budgetPercentage}% Utilized
          </div>
        </div>

        {/* Dual-tone custom progress bar */}
        <div className="flex flex-col space-y-space-xs">
          <div className="w-full h-3.5 rounded-full bg-surface-container-high overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all duration-700"
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface font-semibold">
              ${monthlySpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} spent
            </span>
            <span className="text-outline">
              ${monthlyCap.toLocaleString('en-US', { minimumFractionDigits: 2 })} cap
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-space-sm rounded-2xl bg-surface-container-low text-on-surface">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
            <span className="font-body-sm text-body-sm">{daysRemaining} days remaining</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="font-label-md text-label-md font-semibold text-primary">
              ${safePacePerDay.toFixed(2)}/day safe pace
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown (Visual Outflow Bars) */}
      <div className="w-full rounded-3xl p-space-lg bg-surface-container-lowest shadow-sm flex flex-col space-y-space-md border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Categorization
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Top Outflows</h3>
          </div>
          <button
            type="button"
            onClick={onNavigateToCharts}
            className="font-label-md text-label-md text-primary font-semibold hover:underline"
          >
            Full Report
          </button>
        </div>

        {/* Segmented Bar */}
        <div className="flex flex-col space-y-space-md">
          <div className="w-full h-4 rounded-full overflow-hidden flex gap-0.5 bg-surface-container-high">
            {outflows.map((item) => (
              <div
                key={item.name}
                className={`h-full ${item.colorClass} transition-all`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.name}: ${item.percentage}% ($${item.amount.toFixed(2)})`}
              />
            ))}
          </div>

          {/* Categories Detailed Grid */}
          <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
            {outflows.slice(0, 4).map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.dotColorClass}`} />
                  <span className="font-label-md text-label-md text-on-surface truncate">{item.name}</span>
                </div>
                <span className="font-label-md text-label-md font-bold text-on-surface">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Bill Reminders */}
      <div className="flex flex-col space-y-space-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Scheduled Obligations
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Upcoming Bills</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold">
            {bills.filter((b) => !b.isPaid).length} Pending
          </span>
        </div>

        {/* Horizontal Bills Carousel */}
        <div className="flex overflow-x-auto gap-space-sm pb-1 pt-1 -mx-margin px-margin no-scrollbar">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className={`min-w-[240px] max-w-[250px] flex-shrink-0 rounded-2xl bg-surface-container-lowest p-space-md shadow-sm flex flex-col justify-between space-y-space-md border border-surface-container-high/40 transition-all ${
                bill.isPaid ? 'opacity-70 bg-surface-container-low' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl ${bill.iconBgClass} flex items-center justify-center ${bill.iconTextClass}`}>
                  <span className="material-symbols-outlined text-[20px]">{bill.icon}</span>
                </div>
                {bill.isAutoPay ? (
                  <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                    Auto-Pay ON
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                    {bill.accountText}
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">{bill.title}</h4>
                <p className="font-body-sm text-body-sm text-outline">{bill.dueText}</p>
              </div>

              <div className="flex items-baseline justify-between pt-space-xs border-t border-surface-container-low/60">
                <span className="font-numeric-metric text-numeric-metric text-on-surface">
                  ${bill.amount.toFixed(2)}
                </span>
                {bill.isPaid ? (
                  <span className="inline-flex items-center gap-1 text-primary text-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Paid
                  </span>
                ) : bill.isAutoPay ? (
                  <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onPayBill(bill.id)}
                    className="font-label-md text-label-md text-primary font-bold hover:underline active:scale-95"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions Feed */}
      <div className="w-full flex flex-col space-y-space-md">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Ledger Feed
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Recent Activity</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            aria-label="Filter transactions"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              showFilterDrawer || selectedFilterCategory !== 'All'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>

        {/* Filter Drawer Pills */}
        {showFilterDrawer && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar animate-fadeIn">
            {['All', 'Dining', 'Income', 'Groceries', 'Subscription', 'Transport'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilterCategory(filter)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedFilterCategory === filter
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}

        {/* Date Group: Today */}
        {todayTransactions.length > 0 && (
          <div className="flex flex-col space-y-space-xs">
            <div className="flex items-center gap-space-xs px-1">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                Today
              </span>
              <div className="flex-1 h-px bg-surface-container-high" />
            </div>

            <div className="w-full rounded-2xl bg-surface-container-lowest shadow-sm divide-y divide-surface-container-low overflow-hidden border border-surface-container-high/40">
              {todayTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-space-md hover:bg-surface-container-low/50 transition-colors"
                >
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className={`w-11 h-11 rounded-2xl ${tx.iconBgClass} flex items-center justify-center ${tx.iconTextClass} flex-shrink-0`}>
                      <span className="material-symbols-outlined text-[20px]">{tx.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                        {tx.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-outline">
                        <span className="font-body-sm text-body-sm">{tx.category}</span>
                        <span className="text-[8px]">•</span>
                        <span className="font-body-sm text-body-sm">{tx.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 pl-2">
                    <span
                      className={`font-headline-md text-headline-md font-semibold ${
                        tx.amount > 0 ? 'text-primary font-bold' : 'text-on-surface'
                      }`}
                    >
                      {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`font-label-sm text-label-sm ${tx.amount > 0 ? 'text-primary' : 'text-outline'}`}>
                      {tx.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Date Group: Yesterday & Earlier */}
        {yesterdayTransactions.length > 0 && (
          <div className="flex flex-col space-y-space-xs pt-space-xs">
            <div className="flex items-center gap-space-xs px-1">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                Yesterday
              </span>
              <div className="flex-1 h-px bg-surface-container-high" />
            </div>

            <div className="w-full rounded-2xl bg-surface-container-lowest shadow-sm divide-y divide-surface-container-low overflow-hidden border border-surface-container-high/40">
              {yesterdayTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-space-md hover:bg-surface-container-low/50 transition-colors"
                >
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className={`w-11 h-11 rounded-2xl ${tx.iconBgClass} flex items-center justify-center ${tx.iconTextClass} flex-shrink-0`}>
                      <span className="material-symbols-outlined text-[20px]">{tx.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                        {tx.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-outline">
                        <span className="font-body-sm text-body-sm">{tx.category}</span>
                        <span className="text-[8px]">•</span>
                        <span className="font-body-sm text-body-sm">{tx.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 pl-2">
                    <span
                      className={`font-headline-md text-headline-md font-semibold ${
                        tx.amount > 0 ? 'text-primary font-bold' : 'text-on-surface'
                      }`}
                    >
                      {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">{tx.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
