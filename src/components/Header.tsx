import React from 'react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'dashboard':
        return 'Dashboard';
      case 'charts':
        return 'Analytics & Charts';
      case 'budgets':
        return 'Budgets & Goals';
      case 'ai-insights':
        return 'Aura AI Advisor';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_12px_rgba(15,23,42,0.03)] border-b border-surface-container-high/60 pt-safe">
      <div className="h-16 px-gutter flex items-center justify-between gap-space-sm max-w-lg mx-auto">
        {/* Brand Lockup */}
        <div className="flex items-center gap-space-sm">
          <img
            alt="Aura Wealth Emblem"
            className="h-8 w-auto object-contain transition-transform hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XJTWfCEo0uev9JFIER-0hEgqF1s0Q7enC5X260yoVvAB0nd8-aQwfykUz_ooTjRjvIZ0KsHziPj9IQOAa3SZmxhIcUW2Id3VBpuKIIluK6jST04i773rPY2mA5FSx5sMojdHXyaiC5Ft6E6x4Ufs7k1wU7oFIwFmeUcoe2vZT_tagkAPUUPatMs5FlLj4LZdsRWEJccqmXOgwKZ-8TweYXc3GePc-0IfnMobKYeQoISDnm2_f14SFS"
          />
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Aura Wealth
            </span>
            <h1 className="font-headline-md text-headline-md text-on-surface leading-none font-semibold">
              {getScreenTitle()}
            </h1>
          </div>
        </div>

        {/* Action Zone */}
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low relative transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="User Profile"
            className="pl-space-xs focus:outline-none rounded-full"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 hover:ring-primary transition-all hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZBEc66wufGAmiisuvcLmB2KDnQiBiPJnBfUVZyNFpF6V5hCqS8QPt9vb04kp_s3yd095_MZqAyUSC6c_nSP90qSp7b206OKRl-eHP7OjGri-645pd1bltwtxxfkMObyiQC23pBVrQNJMyyUfkqs0oQZVvF1FzsdWy2K403FrdTW1Md7oBoQhZ10cpqKUmpXop21VEvA-zX2TGiGPeyefVXSuPvXtZ8k6wrU_H_vf2daSEuyKkZfk"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
