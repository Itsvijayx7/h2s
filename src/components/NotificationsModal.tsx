import React from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: string;
  icon: string;
  read: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClear: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-on-surface/40 backdrop-blur-sm transition-all">
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-surface-container-high max-h-[85vh] flex flex-col"
        role="dialog"
      >
        <div className="w-12 h-1 bg-outline-variant/60 rounded-full mx-auto mt-3 sm:hidden" />

        <div className="px-space-lg pt-4 pb-3 flex items-center justify-between border-b border-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">notifications</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Mark Read
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface ml-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <div className="p-space-md space-y-space-sm overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-outline">
              <span className="material-symbols-outlined text-[36px] mb-2 opacity-50">mark_email_read</span>
              <p className="text-sm">No new alerts right now.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl flex items-start gap-3 transition-colors ${
                  item.read
                    ? 'bg-surface-container-low/50 text-on-surface-variant'
                    : 'bg-surface-container-low text-on-surface border-l-4 border-primary'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.type === 'ai'
                      ? 'bg-secondary-fixed/50 text-secondary'
                      : item.type === 'success'
                      ? 'bg-primary-fixed/50 text-primary'
                      : 'bg-surface-container-highest text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-label-md font-semibold truncate text-on-surface">{item.title}</h4>
                    <span className="text-[10px] text-outline flex-shrink-0">{item.time}</span>
                  </div>
                  <p className="font-body-sm text-outline mt-0.5 leading-snug">{item.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-space-md border-t border-surface-container-low">
            <button
              type="button"
              onClick={onClear}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-outline hover:text-error hover:bg-error-container/20 transition-colors"
            >
              Clear All Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
