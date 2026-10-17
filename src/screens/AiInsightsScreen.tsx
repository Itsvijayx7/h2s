import React, { useState } from 'react';
import { RecurringSubscription } from '../types';

interface AiInsightsScreenProps {
  netWorth: number;
  monthlySpent: number;
  subscriptions: RecurringSubscription[];
  onTogglePauseSubscription: (subId: string) => void;
  onApplyPromo: (subId: string, newPrice: number) => void;
}

export const AiInsightsScreen: React.FC<AiInsightsScreenProps> = ({
  netWorth,
  monthlySpent,
  subscriptions,
  onTogglePauseSubscription,
  onApplyPromo,
}) => {
  // Scenario Simulator sliders
  const [cutDiningAmount, setCutDiningAmount] = useState(100);
  const [extraInvestAmount, setExtraInvestAmount] = useState(300);

  // Projections calculation
  const totalMonthlySavingsFromSliders = cutDiningAmount + extraInvestAmount;
  const annualCompoundedReturn = 0.084; // 8.4% APY
  // Future value of monthly annuity: FV = P * (((1 + r/12)^(12*t) - 1) / (r/12))
  const monthlyRate = annualCompoundedReturn / 12;
  const fiveYearMonths = 60;
  const extraFiveYearWealth =
    totalMonthlySavingsFromSliders *
    ((Math.pow(1 + monthlyRate, fiveYearMonths) - 1) / monthlyRate);

  const threeMonthProjected = netWorth + (5250 + cutDiningAmount) * 3;
  const sixMonthProjected = netWorth + (5250 + cutDiningAmount) * 6 * 1.04;
  const oneYearProjected = netWorth + (5250 + cutDiningAmount) * 12 * 1.084;

  const totalSubsCost = subscriptions
    .filter((s) => !s.isPaused)
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="flex flex-col w-full px-margin space-y-space-lg pb-14">
      {/* Hero Aura AI Engine Status */}
      <div className="relative w-full rounded-3xl bg-surface-container-lowest p-space-lg shadow-xl overflow-hidden mt-space-sm border border-surface-container-high/40">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-gradient-to-br from-primary-fixed/40 via-secondary-fixed/30 to-transparent blur-3xl pointer-events-none" />

        <div className="relative flex flex-col space-y-space-sm">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[16px] text-secondary animate-spin" style={{ animationDuration: '6s' }}>
                auto_awesome
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-wide font-bold">
                Aura AI Engine
              </span>
            </div>
            <span className="text-xs font-semibold text-primary">Neural Health: Optimal</span>
          </div>

          <h2 className="font-headline-lg text-headline-lg text-on-surface">Financial Intelligence</h2>
          <p className="font-body-md text-outline">
            Continuous algorithmic audits of your spending velocity, compound interest potential, and recurring cash drains.
          </p>
        </div>
      </div>

      {/* Live Wealth Forecast Projections */}
      <div className="w-full rounded-3xl p-space-lg bg-surface-container-lowest shadow-sm space-y-space-md border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-outline uppercase tracking-wider">Predictive Trajectory</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Projected Milestones</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-primary-fixed/60 text-primary font-bold text-xs">
            +8.4% APY Model
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-3 rounded-2xl bg-surface-container-low flex flex-col justify-between">
            <span className="text-xs text-outline font-medium">In 3 Months</span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold mt-1 font-mono">
              ${(threeMonthProjected / 1000).toFixed(1)}k
            </span>
            <span className="text-[10px] text-primary mt-1 font-medium">Jul 2026</span>
          </div>

          <div className="p-3 rounded-2xl bg-surface-container-low flex flex-col justify-between">
            <span className="text-xs text-outline font-medium">In 6 Months</span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold mt-1 font-mono">
              ${(sixMonthProjected / 1000).toFixed(1)}k
            </span>
            <span className="text-[10px] text-primary mt-1 font-medium">Oct 2026</span>
          </div>

          <div className="p-3 rounded-2xl bg-surface-container-low border border-primary/30 flex flex-col justify-between">
            <span className="text-xs text-primary font-semibold">In 12 Months</span>
            <span className="font-headline-md text-headline-md text-primary font-bold mt-1 font-mono">
              ${(oneYearProjected / 1000).toFixed(1)}k
            </span>
            <span className="text-[10px] text-primary font-bold mt-1">Crosses $100k 🎉</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-surface-container-low flex items-start gap-2.5 text-xs text-on-surface leading-relaxed">
          <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0 mt-0.5">
            flight_takeoff
          </span>
          <div>
            <strong className="font-semibold text-primary">Bali Vacation Alert:</strong> Your lower dining spend has shifted your $5,000 funding milestone <span className="font-semibold text-primary">12 days earlier</span> to May 8, 2026.
          </div>
        </div>
      </div>

      {/* Subscription Optimizer Section */}
      <div className="w-full rounded-3xl p-space-lg bg-surface-container-lowest shadow-sm space-y-space-md border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-outline uppercase tracking-wider">Recurring Drain Audit</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Subscription Optimizer</h3>
          </div>
          <div className="text-right">
            <span className="font-headline-md text-headline-md font-bold text-on-surface font-mono">
              ${totalSubsCost.toFixed(2)}
            </span>
            <div className="text-[11px] text-outline">monthly outflow</div>
          </div>
        </div>

        <div className="space-y-3">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                sub.isPaused
                  ? 'bg-surface-container-low/40 border-dashed border-outline-variant/60 opacity-60'
                  : sub.isOptimizable
                  ? 'bg-surface-container-low border-secondary/40 shadow-sm'
                  : 'bg-surface-container-low border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{sub.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-label-md font-semibold text-on-surface truncate">{sub.name}</h4>
                    <span className="text-xs text-outline">{sub.category} · Renews {sub.renewalDate}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-2">
                  <span className="font-label-md font-bold text-on-surface">
                    ${sub.price.toFixed(2)}/mo
                  </span>
                  <div>
                    {sub.isPaused && (
                      <span className="text-[10px] font-semibold text-outline">Paused</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Optimization Recommendation Box */}
              {sub.isOptimizable && !sub.isPaused && sub.savingsOpportunity && (
                <div className="mt-2.5 pt-2 border-t border-surface-container flex items-center justify-between gap-2">
                  <p className="text-xs text-secondary font-medium leading-snug">
                    💡 {sub.savingsOpportunity}
                  </p>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {sub.id === 'sub-5' ? (
                      <button
                        type="button"
                        onClick={() => onApplyPromo(sub.id, 12.00)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-secondary text-on-secondary shadow-sm hover:opacity-90 active:scale-95 transition-all"
                      >
                        Claim $12 Promo
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onTogglePauseSubscription(sub.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-container-highest text-primary hover:bg-surface-container transition-all active:scale-95"
                      >
                        Pause 30d
                      </button>
                    )}
                  </div>
                </div>
              )}

              {sub.isPaused && (
                <div className="mt-2 pt-2 border-t border-surface-container flex items-center justify-between">
                  <span className="text-xs text-primary font-semibold">Paused · Saving ${sub.price.toFixed(2)}/mo</span>
                  <button
                    type="button"
                    onClick={() => onTogglePauseSubscription(sub.id)}
                    className="text-xs text-primary underline font-medium"
                  >
                    Resume
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive "What-If" Scenario Simulator */}
      <div className="w-full rounded-3xl p-space-lg bg-surface-container-lowest shadow-sm space-y-space-md border border-surface-container-high/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-label-sm text-outline uppercase tracking-wider">Compound Engine</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">"What-If" Scenario Lab</h3>
          </div>
          <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
        </div>

        {/* Sliders */}
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-on-surface">Trim Dining & Drinks by:</span>
              <span className="text-primary font-bold font-mono">+${cutDiningAmount}/mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="400"
              step="25"
              value={cutDiningAmount}
              onChange={(e) => setCutDiningAmount(parseInt(e.target.value, 10))}
              className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-on-surface">Auto-Invest extra monthly surplus:</span>
              <span className="text-secondary font-bold font-mono">+${extraInvestAmount}/mo</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={extraInvestAmount}
              onChange={(e) => setExtraInvestAmount(parseInt(e.target.value, 10))}
              className="w-full accent-secondary h-2 bg-surface-container-high rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Real-Time Outcome Calculation Card */}
        <div className="p-space-md rounded-2xl bg-gradient-to-br from-primary-fixed/40 via-surface-container-low to-secondary-fixed/30 border border-primary/20 space-y-2">
          <div className="text-xs text-outline font-semibold uppercase tracking-wider">
            Projected 5-Year Net Wealth Boost
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-numeric-hero text-numeric-hero text-primary font-bold">
              +${extraFiveYearWealth.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-outline font-medium">with 8.4% APY compounding</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            By saving an additional ${totalMonthlySavingsFromSliders}/month, you generate an estimated{' '}
            <strong className="text-primary font-semibold">
              ${(extraFiveYearWealth - totalMonthlySavingsFromSliders * 60).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </strong>{' '}
            purely in compound dividend growth!
          </p>
        </div>
      </div>
    </div>
  );
};
