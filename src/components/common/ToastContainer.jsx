import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
  error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
  info: <Info className="h-5 w-5 text-indigo-500 shrink-0" />
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-md transition-all animate-slide-up dark:border-slate-800/80 dark:bg-slate-900/95"
        >
          {icons[toast.type] || icons.info}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {toast.title}
              </h4>
            )}
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
