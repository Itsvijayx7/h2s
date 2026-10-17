import React from 'react';
import { ConnectedAccount } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: ConnectedAccount[];
  isAuraSyncActive: boolean;
  onToggleAuraSync: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  accounts,
  isAuraSyncActive,
  onToggleAuraSync,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-on-surface/40 backdrop-blur-sm transition-all">
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-surface-container-high max-h-[90vh] flex flex-col"
        role="dialog"
      >
        <div className="w-12 h-1 bg-outline-variant/60 rounded-full mx-auto mt-3 sm:hidden" />

        <div className="px-space-lg pt-4 pb-3 flex items-center justify-between border-b border-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">account_circle</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Member Profile</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-space-lg space-y-space-md overflow-y-auto">
          {/* User Card */}
          <div className="flex items-center gap-space-md p-space-md rounded-2xl bg-surface-container-low">
            <img
              alt="Profile avatar"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-primary"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZBEc66wufGAmiisuvcLmB2KDnQiBiPJnBfUVZyNFpF6V5hCqS8QPt9vb04kp_s3yd095_MZqAyUSC6c_nSP90qSp7b206OKRl-eHP7OjGri-645pd1bltwtxxfkMObyiQC23pBVrQNJMyyUfkqs0oQZVvF1FzsdWy2K403FrdTW1Md7oBoQhZ10cpqKUmpXop21VEvA-zX2TGiGPeyefVXSuPvXtZ8k6wrU_H_vf2daSEuyKkZfk"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Vijay Dodkey</h3>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">
                  Aura Black
                </span>
              </div>
              <span className="text-xs text-outline font-mono">vijaydodkey57@gmail.com</span>
              <span className="text-xs text-primary font-medium mt-0.5">Tier 1 Sovereign Portfolio</span>
            </div>
          </div>

          {/* Aura Sync Switch */}
          <div className="p-space-md rounded-2xl bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed/40 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">sync</span>
              </div>
              <div>
                <h4 className="font-label-md text-on-surface font-semibold">Aura Real-Time Sync</h4>
                <p className="text-xs text-outline">Continuous OpenBanking API polling</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleAuraSync}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                isAuraSyncActive ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isAuraSyncActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Connected Institutions List */}
          <div className="space-y-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-outline uppercase tracking-wider">
                Connected Institutions ({accounts.length})
              </span>
              <button className="text-xs font-semibold text-primary hover:underline">
                + Link Account
              </button>
            </div>

            <div className="divide-y divide-surface-container-low rounded-2xl bg-surface-container-low/70 overflow-hidden">
              {accounts.map((acc) => (
                <div key={acc.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="material-symbols-outlined text-[20px] text-outline">
                      {acc.type === 'invested' ? 'trending_up' : acc.type === 'debt' ? 'credit_card' : 'account_balance'}
                    </span>
                    <div className="min-w-0">
                      <div className="font-label-md font-semibold text-on-surface truncate">{acc.name}</div>
                      <div className="text-xs text-outline">{acc.institution} · {acc.accountNumberMask}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 pl-2">
                    <div className="font-label-md font-bold text-on-surface">
                      ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-primary">{acc.apy || 'Active'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Vault Note */}
          <div className="p-3 rounded-xl bg-surface-container text-xs text-outline flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">security</span>
            <span>256-bit AES Vault Encryption · Read-only tokenized banking rails</span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-surface-container-highest text-on-surface font-label-md font-semibold hover:bg-surface-container transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
