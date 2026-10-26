import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import {
  Bell,
  CheckCheck,
  Trash2,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X
} from 'lucide-react';

const typeIcons = {
  info: <Info size={14} className="text-indigo-500 shrink-0 mt-0.5" />,
  success: <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />,
  error: <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
};

export const NotificationCenter = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        title="Notification Center (Context API with useReducer)"
        aria-label="Open notifications"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950 animate-pulse-subtle">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 z-50 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  title="Mark all as read"
                >
                  <CheckCheck size={13} />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
          </div>

          {/* Subtitle highlighting Context useReducer pattern */}
          <div className="py-1.5 px-2 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl my-2 text-[10px] text-indigo-700 dark:text-indigo-300 font-mono">
            State: Context API + useReducer Architecture
          </div>

          {/* Notifications List */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1 my-2">
            {notifications.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">
                No notifications to display
              </p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && markAsRead(notif.id)}
                  className={`group relative flex items-start gap-2.5 rounded-2xl p-2.5 transition text-xs cursor-pointer ${
                    notif.isRead
                      ? 'bg-slate-50/50 hover:bg-slate-100/60 dark:bg-slate-800/30 dark:hover:bg-slate-800/60 opacity-80'
                      : 'bg-indigo-50/40 border border-indigo-100/80 hover:bg-indigo-50/80 dark:bg-indigo-950/20 dark:border-indigo-900/40'
                  }`}
                >
                  {typeIcons[notif.type] || typeIcons.info}
                  <div className="flex-1 min-w-0 pr-6">
                    <p className={`font-semibold ${notif.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white font-bold'}`}>
                      {notif.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {notif.timestamp}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notif.id);
                    }}
                    className="absolute top-2 right-2 rounded-lg p-1 text-slate-400 opacity-0 group-hover:opacity-100 transition hover:bg-white hover:text-rose-500 dark:hover:bg-slate-800"
                    title="Dismiss notification"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400">
                {notifications.length} total alerts
              </span>
              <button
                onClick={clearAllNotifications}
                className="inline-flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-700 font-medium"
              >
                <Trash2 size={12} />
                <span>Clear all</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
