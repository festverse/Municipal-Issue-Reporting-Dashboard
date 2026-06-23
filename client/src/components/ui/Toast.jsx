import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

let toastId = 0;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const colorMap = {
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', bar: 'bg-emerald-500', icon: '✓' },
    error:   { bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-800',    bar: 'bg-rose-500',    icon: '✕' },
    warning: { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-800',   bar: 'bg-amber-500',   icon: '⚠' },
    info:    { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-800',    bar: 'bg-blue-500',    icon: 'ℹ' },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => {
          const c = colorMap[t.type] || colorMap.info;
          return (
            <div
              key={t.id}
              className={`pointer-events-auto animate-slide-in-right min-w-[320px] max-w-[420px] ${c.bg} ${c.border} border rounded-xl overflow-hidden shadow-2xl backdrop-blur-md`}
            >
              <div className="flex items-start gap-3 px-4 py-3">
                <span className={`${c.text} text-lg mt-0.5 flex-shrink-0`}>{c.icon}</span>
                <p className={`${c.text} text-sm font-medium flex-1`}>{t.message}</p>
                <button
                  onClick={() => dismiss(t.id)}
                  className={`${c.text} hover:opacity-70 transition-opacity text-lg leading-none flex-shrink-0`}
                >
                  ×
                </button>
              </div>
              {/* Progress bar */}
              <div className="h-0.5 w-full bg-white/5">
                <div className={`h-full ${c.bar} toast-progress`} />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
