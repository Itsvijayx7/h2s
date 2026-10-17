import React, { useState } from 'react';
import { SavingsGoal } from '../types';

interface BudgetsScreenProps {
  monthlySpent: number;
  monthlyCap: number;
  daysRemaining: number;
  safePacePerDay: number;
  goals: SavingsGoal[];
  onAddFundsToGoal: (goalId: string, amount: number) => void;
  onCreateGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onUpdateBudgetCap: (newCap: number) => void;
}

export const BudgetsScreen: React.FC<BudgetsScreenProps> = ({
  monthlySpent,
  monthlyCap,
  daysRemaining,
  safePacePerDay,
  goals,
  onAddFundsToGoal,
  onCreateGoal,
  onUpdateBudgetCap,
}) => {
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showEditCapModal, setShowEditCapModal] = useState(false);
  const [newCapInput, setNewCapInput] = useState(monthlyCap.toString());

  // New goal state
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalInitial, setNewGoalInitial] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('Travel');

  const budgetPercentage = Math.min(100, Math.round((monthlySpent / monthlyCap) * 100));
  const headroom = Math.max(0, monthlyCap - monthlySpent);

  const handleCreateGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newGoalTarget);
    const initial = parseFloat(newGoalInitial) || 0;
    if (isNaN(target) || target <= 0) return;

    onCreateGoal({
      title: newGoalTitle.trim() || 'New Savings Target',
      targetAmount: target,
      currentAmount: initial,
      category: newGoalCategory,
      targetDate: 'Dec 31, 2026',
      paceNote: 'New goal initialized',
      icon: newGoalCategory === 'Travel' ? 'flight_takeoff' : 'savings',
      color: '#006948',
    });

    setNewGoalTitle('');
    setNewGoalTarget('');
    setNewGoalInitial('');
    setShowNewGoalModal(false);
  };

  const handleUpdateCapSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(newCapInput);
    if (!isNaN(parsed) && parsed > 500) {
      onUpdateBudgetCap(parsed);
      setShowEditCapModal(false);
    }
  };

  return (
    <div className="flex flex-col w-full px-margin space-y-space-lg pb-14">
      {/* Primary Budget Envelope Card */}
      <div className="relative w-full rounded-3xl bg-surface-container-lowest p-space-lg shadow-xl overflow-hidden mt-space-sm border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-outline uppercase tracking-wider">April Spending Cap</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h2 className="font-numeric-hero text-numeric-hero text-on-surface tracking-tight">
                ${monthlySpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <span className="text-sm font-semibold text-outline">
                / ${monthlyCap.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowEditCapModal(true)}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-2">
          <div className="w-full h-4 rounded-full bg-surface-container-high overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all duration-700"
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-label-md text-xs">
            <span className="text-primary font-semibold">{budgetPercentage}% utilized</span>
            <span className="text-on-surface font-semibold">${headroom.toFixed(2)} headroom left</span>
          </div>
        </div>

        {/* Safe Pace Banner */}
        <div className="mt-4 p-3 rounded-2xl bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
            <span className="text-xs text-on-surface font-medium">{daysRemaining} days remaining</span>
          </div>
          <div className="inline-flex items-center gap-1 text-primary font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>${safePacePerDay.toFixed(2)}/day safe pace</span>
          </div>
        </div>
      </div>

      {/* Category Envelopes */}
      <div className="w-full rounded-3xl p-space-lg bg-surface-container-lowest shadow-sm space-y-space-md border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-outline uppercase tracking-wider">Discretionary Limits</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Category Envelopes</h3>
          </div>
          <span className="text-xs text-primary font-semibold">Live Balances</span>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Housing & Utilities', spent: 1250, limit: 1250, icon: 'apartment', color: 'bg-primary' },
            { name: 'Dining & Outings', spent: 588, limit: 750, icon: 'restaurant', color: 'bg-secondary' },
            { name: 'Transport & Fuel', spent: 294, limit: 400, icon: 'directions_car', color: 'bg-secondary-fixed-dim' },
            { name: 'Entertainment & Clubs', spent: 245, limit: 350, icon: 'movie', color: 'bg-primary-fixed-dim' },
            { name: 'Groceries & Supplies', spent: 73, limit: 250, icon: 'shopping_basket', color: 'bg-outline' },
          ].map((cat) => {
            const pct = Math.min(100, Math.round((cat.spent / cat.limit) * 100));
            return (
              <div key={cat.name} className="p-3 rounded-2xl bg-surface-container-low space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[20px] text-primary">{cat.icon}</span>
                    <span className="font-label-md text-on-surface font-semibold">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-label-md font-bold text-on-surface">${cat.spent}</span>
                    <span className="text-xs text-outline font-normal"> / ${cat.limit}</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Savings & Wealth Goals Section */}
      <div className="space-y-space-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-outline uppercase tracking-wider">Milestones</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Savings Goals</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowNewGoalModal(true)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Goal
          </button>
        </div>

        <div className="space-y-space-sm">
          {goals.map((goal) => {
            const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <div
                key={goal.id}
                className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container-high/40 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-primary-fixed/50 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[22px]">{goal.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-label-lg font-semibold text-on-surface">{goal.title}</h4>
                      <p className="text-xs text-outline">{goal.targetDate} · {goal.category}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed/60 text-primary font-bold text-[11px]">
                    {goal.paceNote}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-on-surface">
                      ${goal.currentAmount.toLocaleString()} funded ({percent}%)
                    </span>
                    <span className="text-outline">Target: ${goal.targetAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Quick Add Funds Action */}
                <div className="flex items-center justify-between pt-1 border-t border-surface-container-low">
                  <span className="text-[11px] text-outline">Quick Deposit:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onAddFundsToGoal(goal.id, 50)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-container-low hover:bg-surface-container text-primary transition-all active:scale-95"
                    >
                      +$50
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddFundsToGoal(goal.id, 100)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-container-low hover:bg-surface-container text-primary transition-all active:scale-95"
                    >
                      +$100
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddFundsToGoal(goal.id, 250)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary text-on-primary shadow-sm hover:opacity-95 transition-all active:scale-95"
                    >
                      +$250
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Budget Cap Modal */}
      {showEditCapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-space-lg shadow-2xl border border-surface-container-high space-y-4">
            <h3 className="font-headline-md text-on-surface">Adjust Monthly Spending Cap</h3>
            <form onSubmit={handleUpdateCapSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-outline">Target Cap ($)</label>
                <input
                  type="number"
                  min="500"
                  step="50"
                  value={newCapInput}
                  onChange={(e) => setNewCapInput(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-lg font-bold"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditCapModal(false)}
                  className="flex-1 py-2 rounded-xl bg-surface-container text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold"
                >
                  Save Cap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Goal Modal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-space-lg shadow-2xl border border-surface-container-high space-y-4">
            <h3 className="font-headline-md text-on-surface">Create Savings Goal</h3>
            <form onSubmit={handleCreateGoalSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-outline">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Kyoto Trip, Downpayment"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-outline">Target ($)</label>
                  <input
                    type="number"
                    min="100"
                    placeholder="5000"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-outline">Initial Deposit ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="250"
                    value={newGoalInitial}
                    onChange={(e) => setNewGoalInitial(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-outline">Category</label>
                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm"
                >
                  <option value="Travel">Travel & Vacations</option>
                  <option value="Safety Net">Safety Net / Emergency</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Real Estate">Real Estate & Home</option>
                  <option value="Retirement">Retirement Wealth</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewGoalModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-sm"
                >
                  Initialize Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
