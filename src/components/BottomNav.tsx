import React from 'react';
import { ScreenType } from '../types';

interface BottomNavProps {
  currentScreen: ScreenType;
  onChangeScreen: (screen: ScreenType) => void;
  onOpenQuickAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onChangeScreen,
  onOpenQuickAdd,
}) => {
  return (
    <div className="fixed bottom-5 inset-x-0 z-50 flex justify-center px-margin pointer-events-none pb-safe">
      <nav
        aria-label="Bottom Navigation"
        className="pointer-events-auto flex items-center justify-between w-full max-w-[420px] px-space-sm py-space-xs bg-surface-container-lowest/90 backdrop-blur-2xl rounded-full shadow-[0_16px_36px_-6px_rgba(15,23,42,0.12),0_1px_3px_0_rgba(15,23,42,0.04)] ring-1 ring-outline-variant/30"
      >
        {/* Home / Dashboard */}
        <button
          type="button"
          onClick={() => onChangeScreen('dashboard')}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all gap-0.5 ${
            currentScreen === 'dashboard'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">dashboard</span>
          <span className="font-label-sm text-label-sm">Home</span>
        </button>

        {/* Charts / Analytics */}
        <button
          type="button"
          onClick={() => onChangeScreen('charts')}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all gap-0.5 ${
            currentScreen === 'charts'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">monitoring</span>
          <span className="font-label-sm text-label-sm">Charts</span>
        </button>

        {/* Center Floating Quick Add Action */}
        <div className="relative -top-3 flex items-center justify-center">
          <button
            type="button"
            onClick={onOpenQuickAdd}
            aria-label="Quick Add Transaction"
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary text-on-primary flex items-center justify-center shadow-[0_8px_20px_-2px_rgba(0,105,72,0.38)] active:scale-95 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="material-symbols-outlined text-[26px]">add</span>
          </button>
        </div>

        {/* Budgets & Goals */}
        <button
          type="button"
          onClick={() => onChangeScreen('budgets')}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all gap-0.5 ${
            currentScreen === 'budgets'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
          <span className="font-label-sm text-label-sm">Budgets</span>
        </button>

        {/* AI Insights */}
        <button
          type="button"
          onClick={() => onChangeScreen('ai-insights')}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all gap-0.5 relative ${
            currentScreen === 'ai-insights'
              ? 'text-primary font-semibold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[24px] text-primary">auto_awesome</span>
          <span className="font-label-sm text-label-sm text-primary font-semibold">AI Insights</span>
        </button>
      </nav>
    </div>
  );
};
