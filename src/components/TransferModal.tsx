import React, { useState } from 'react';
import { ConnectedAccount } from '../types';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: ConnectedAccount[];
  onTransfer: (fromAccountId: string, toAccountId: string, amount: number) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onTransfer,
}) => {
  const [fromId, setFromId] = useState(accounts[0]?.id || '');
  const [toId, setToId] = useState(accounts[1]?.id || '');
  const [amountStr, setAmountStr] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const fromAcc = accounts.find((a) => a.id === fromId) || accounts[0];
  const toAcc = accounts.find((a) => a.id === toId) || accounts[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;
    if (fromId === toId) return;

    onTransfer(fromId, toId, amount);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setAmountStr('');
      onClose();
    }, 1100);
  };

  const handleQuickAmount = (val: number) => {
    setAmountStr(val.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-on-surface/40 backdrop-blur-sm transition-all">
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-surface-container-high max-h-[90vh] flex flex-col"
        role="dialog"
      >
        <div className="w-12 h-1 bg-outline-variant/60 rounded-full mx-auto mt-3 sm:hidden" />

        <div className="px-space-lg pt-4 pb-2 flex items-center justify-between border-b border-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">swap_horiz</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Account Transfer</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {successMsg ? (
          <div className="p-space-xl flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center text-primary animate-bounce">
              <span className="material-symbols-outlined text-[36px]">check</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Transfer Successful!</h3>
            <p className="font-body-md text-outline">
              Moved ${parseFloat(amountStr).toLocaleString('en-US', { minimumFractionDigits: 2 })} instantly via Aura Sync.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-space-lg space-y-space-md overflow-y-auto">
            {/* From Account */}
            <div className="p-3.5 rounded-2xl bg-surface-container-low space-y-1">
              <span className="font-label-sm text-outline uppercase tracking-wider">Transfer From</span>
              <select
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className="w-full bg-transparent font-label-lg text-on-surface font-semibold focus:outline-none"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} (${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})
                  </option>
                ))}
              </select>
              <div className="text-xs text-outline">Available: ${fromAcc?.balance.toLocaleString()}</div>
            </div>

            {/* Direction Icon */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                type="button"
                onClick={() => {
                  const temp = fromId;
                  setFromId(toId);
                  setToId(temp);
                }}
                className="w-9 h-9 rounded-full bg-surface-container-highest shadow-sm border border-surface-container flex items-center justify-center text-secondary hover:scale-105 transition-transform"
              >
                <span className="material-symbols-outlined text-[20px]">swap_vert</span>
              </button>
            </div>

            {/* To Account */}
            <div className="p-3.5 rounded-2xl bg-surface-container-low space-y-1">
              <span className="font-label-sm text-outline uppercase tracking-wider">Transfer To</span>
              <select
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                className="w-full bg-transparent font-label-lg text-on-surface font-semibold focus:outline-none"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} disabled={acc.id === fromId}>
                    {acc.name} ({acc.institution})
                  </option>
                ))}
              </select>
              <div className="text-xs text-primary font-medium">{toAcc?.apy || 'Standard Checking'}</div>
            </div>

            {/* Amount */}
            <div className="flex flex-col items-center justify-center py-2">
              <label htmlFor="transfer-amt" className="font-label-sm text-outline uppercase tracking-wider mb-1">
                Transfer Amount
              </label>
              <div className="relative flex items-center justify-center">
                <span className="text-3xl font-bold text-on-surface mr-1">$</span>
                <input
                  id="transfer-amt"
                  type="number"
                  step="1"
                  min="1"
                  max={fromAcc?.balance || 100000}
                  placeholder="0"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  required
                  className="w-40 text-3xl font-bold text-on-surface text-center bg-transparent border-b-2 border-secondary focus:border-primary focus:outline-none py-1"
                />
              </div>

              {/* Quick Pills */}
              <div className="flex items-center gap-2 mt-3">
                {[100, 250, 500, 1000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleQuickAmount(v)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                  >
                    +${v}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-space-sm">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-surface-container text-on-surface font-label-md font-semibold hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!amountStr || fromId === toId}
                className="flex-1 py-3 rounded-2xl bg-secondary text-on-secondary font-label-md font-semibold shadow-md hover:opacity-95 transition-all disabled:opacity-50"
              >
                Confirm Transfer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
