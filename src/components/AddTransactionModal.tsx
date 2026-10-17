import React, { useState } from 'react';
import { Transaction } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  defaultType?: 'expense' | 'income';
}

const CATEGORIES = [
  { name: 'Dining', icon: 'local_cafe', bg: 'bg-secondary-fixed/40', text: 'text-secondary' },
  { name: 'Groceries', icon: 'shopping_basket', bg: 'bg-primary-fixed/40', text: 'text-primary' },
  { name: 'Housing', icon: 'apartment', bg: 'bg-surface-container-high', text: 'text-on-surface' },
  { name: 'Transport', icon: 'directions_car', bg: 'bg-secondary-container/40', text: 'text-secondary' },
  { name: 'Entertainment', icon: 'movie', bg: 'bg-tertiary-fixed/40', text: 'text-tertiary' },
  { name: 'Subscription', icon: 'graphic_eq', bg: 'bg-surface-container-low', text: 'text-on-surface-variant' },
  { name: 'Health', icon: 'fitness_center', bg: 'bg-surface-container-highest', text: 'text-primary' },
  { name: 'Income', icon: 'account_balance', bg: 'bg-primary-fixed/60', text: 'text-primary' },
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  defaultType = 'expense',
}) => {
  const [type, setType] = useState<'expense' | 'income'>(defaultType);
  const [amountStr, setAmountStr] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Dining');
  const [paymentMethod, setPaymentMethod] = useState('Apple Pay');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountStr);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const selectedCat = CATEGORIES.find((c) => c.name === category) || CATEGORIES[0];
    const finalAmount = type === 'expense' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount);

    onAddTransaction({
      title: merchant.trim() || (type === 'expense' ? 'Outflow Spend' : 'Inflow Credit'),
      category: type === 'income' ? 'Income' : category,
      paymentMethod,
      amount: finalAmount,
      dateGroup: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: type === 'income' ? 'account_balance' : selectedCat.icon,
      iconBgClass: type === 'income' ? 'bg-primary-fixed/40' : selectedCat.bg,
      iconTextClass: type === 'income' ? 'text-primary' : selectedCat.text,
    });

    setAmountStr('');
    setMerchant('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-on-surface/40 backdrop-blur-sm transition-all animate-fadeIn">
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-surface-container-high max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Grab Handle for touch */}
        <div className="w-12 h-1 bg-outline-variant/60 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Header */}
        <div className="px-space-lg pt-4 pb-2 flex items-center justify-between border-b border-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">add_circle</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Record Transaction</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-space-lg space-y-space-md overflow-y-auto">
          {/* Spend vs Income Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-surface-container-low gap-1">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'Income') setCategory('Dining');
              }}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Expense Outflow
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Income');
              }}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Income Inflow
            </button>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col items-center justify-center py-2">
            <label htmlFor="amount" className="font-label-sm text-outline uppercase tracking-wider mb-1">
              Amount ({type === 'expense' ? 'Debit' : 'Credit'})
            </label>
            <div className="relative flex items-center justify-center w-full">
              <span className="text-3xl font-bold text-on-surface mr-1">$</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                autoFocus
                required
                className="w-48 text-4xl font-bold text-on-surface text-center bg-transparent border-b-2 border-primary/40 focus:border-primary focus:outline-none py-1 font-numeric-hero"
              />
            </div>
          </div>

          {/* Merchant / Payee */}
          <div>
            <label htmlFor="merchant" className="block font-label-md text-on-surface font-semibold mb-1">
              {type === 'expense' ? 'Merchant / Recipient' : 'Payer / Source'}
            </label>
            <input
              id="merchant"
              type="text"
              placeholder={type === 'expense' ? 'e.g. Sweetgreen, Target, Uber' : 'e.g. Client Wire, Bonus, TechCorp'}
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Category Picker */}
          {type === 'expense' && (
            <div>
              <label className="block font-label-md text-on-surface font-semibold mb-2">
                Category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.filter((c) => c.name !== 'Income').map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategory(cat.name)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-xs ${
                      category === cat.name
                        ? 'border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary'
                        : 'border-transparent bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] mb-1">{cat.icon}</span>
                    <span className="truncate w-full text-center">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label htmlFor="method" className="block font-label-md text-on-surface font-semibold mb-1">
                Account / Method
              </label>
              <select
                id="method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Apple Pay">Apple Pay</option>
                <option value="Visa 8820">Visa 8820</option>
                <option value="Checking">Checking •••• 4091</option>
                <option value="MasterCard 4410">MasterCard 4410</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block font-label-md text-on-surface font-semibold mb-1">
                Note (Optional)
              </label>
              <input
                id="notes"
                type="text"
                placeholder="Lunch with team"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
              </input>
            </div>
          </div>

          {/* Submit Actions */}
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
              className="flex-1 py-3 rounded-2xl bg-primary text-on-primary font-label-md font-semibold shadow-md hover:bg-primary-container transition-all active:scale-95"
            >
              Save to Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
