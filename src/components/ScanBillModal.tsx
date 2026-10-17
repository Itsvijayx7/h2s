import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';

interface ScanBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const SAMPLE_RECEIPTS = [
  {
    merchant: 'Sweetgreen Organic',
    amount: 18.40,
    category: 'Dining',
    tax: 1.60,
    subtotal: 16.80,
    date: 'Today, 12:45 PM',
    card: 'Apple Pay',
    icon: 'local_cafe',
    iconBgClass: 'bg-secondary-fixed/40',
    iconTextClass: 'text-secondary',
  },
  {
    merchant: 'Chevron Fuel & Market',
    amount: 48.50,
    category: 'Transport',
    tax: 4.10,
    subtotal: 44.40,
    date: 'Today, 08:15 AM',
    card: 'Visa 8820',
    icon: 'directions_car',
    iconBgClass: 'bg-secondary-container/40',
    iconTextClass: 'text-secondary',
  },
  {
    merchant: 'Pacific Gas & Electric',
    amount: 112.30,
    category: 'Housing',
    tax: 0.00,
    subtotal: 112.30,
    date: 'Today, 10:00 AM',
    card: 'Checking •••• 4091',
    icon: 'apartment',
    iconBgClass: 'bg-surface-container-high',
    iconTextClass: 'text-on-surface',
  },
];

export const ScanBillModal: React.FC<ScanBillModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [selectedReceiptIndex, setSelectedReceiptIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<typeof SAMPLE_RECEIPTS[0] | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Start scanning simulation
      setIsScanning(true);
      setScannedResult(null);
      const timer = setTimeout(() => {
        setIsScanning(false);
        setScannedResult(SAMPLE_RECEIPTS[selectedReceiptIndex]);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [isOpen, selectedReceiptIndex]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!scannedResult) return;
    onAddTransaction({
      title: scannedResult.merchant,
      category: scannedResult.category,
      paymentMethod: scannedResult.card,
      amount: -scannedResult.amount,
      dateGroup: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: scannedResult.icon,
      iconBgClass: scannedResult.iconBgClass,
      iconTextClass: scannedResult.iconTextClass,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-on-surface/40 backdrop-blur-sm transition-all">
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-surface-container-high max-h-[92vh] flex flex-col"
        role="dialog"
      >
        <div className="w-12 h-1 bg-outline-variant/60 rounded-full mx-auto mt-3 sm:hidden" />

        <div className="px-space-lg pt-4 pb-2 flex items-center justify-between border-b border-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">document_scanner</span>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Smart Bill Scanner</h2>
              <span className="text-xs text-outline">Aura AI Vision OCR Engine</span>
            </div>
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
          {/* Sample Switcher */}
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-outline uppercase tracking-wider">Select Sample Receipt</span>
            <div className="flex gap-1.5">
              {SAMPLE_RECEIPTS.map((item, idx) => (
                <button
                  key={item.merchant}
                  type="button"
                  onClick={() => {
                    setSelectedReceiptIndex(idx);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedReceiptIndex === idx
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Scanner Viewport */}
          <div className="relative w-full h-52 rounded-2xl bg-slate-950 overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-dashed border-primary/40">
            {/* Viewfinder corners */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary-fixed" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary-fixed" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary-fixed" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary-fixed" />

            {/* Scanning line animation */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary-fixed to-transparent shadow-[0_0_12px_#85f8c4] animate-pulse top-1/2 -translate-y-1/2" />
            )}

            {/* Receipt Preview Representation */}
            <div className="bg-white/95 rounded-lg p-3 text-slate-800 w-48 shadow-lg transform rotate-[-1deg] text-[11px] font-mono select-none">
              <div className="text-center font-bold uppercase tracking-wider text-xs">
                {SAMPLE_RECEIPTS[selectedReceiptIndex].merchant}
              </div>
              <div className="text-center text-[9px] text-slate-500 mb-2">TAX INVOICE #94821</div>
              <div className="border-t border-b border-dashed border-slate-300 py-1 space-y-0.5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${SAMPLE_RECEIPTS[selectedReceiptIndex].subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Sales Tax</span>
                  <span>${SAMPLE_RECEIPTS[selectedReceiptIndex].tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xs pt-1">
                <span>TOTAL</span>
                <span className="text-primary font-bold">
                  ${SAMPLE_RECEIPTS[selectedReceiptIndex].amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="absolute bottom-2 flex items-center gap-1.5 text-xs text-white/80 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
              <span className="material-symbols-outlined text-[14px] text-primary-fixed">
                {isScanning ? 'sync' : 'verified'}
              </span>
              <span>{isScanning ? 'Extracting merchant & total...' : '100% OCR Confidence'}</span>
            </div>
          </div>

          {/* Scanned Data Output */}
          {scannedResult && !isScanning && (
            <div className="p-3.5 rounded-2xl bg-surface-container-low space-y-2 border border-surface-container-high">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-on-surface font-semibold">{scannedResult.merchant}</h4>
                    <span className="text-xs text-outline">{scannedResult.category} · {scannedResult.card}</span>
                  </div>
                </div>
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  ${scannedResult.amount.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 flex items-center gap-space-sm">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-surface-container text-on-surface font-label-md font-semibold hover:bg-surface-container-high transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isScanning || !scannedResult}
              className="flex-1 py-3 rounded-2xl bg-primary text-on-primary font-label-md font-semibold shadow-md hover:bg-primary-container transition-all active:scale-95 disabled:opacity-50"
            >
              Add to Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
