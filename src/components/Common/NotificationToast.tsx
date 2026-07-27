import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastItemProps {
  notif: {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'danger';
    timestamp: string;
  };
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ notif, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notif.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notif.id, onDismiss]);

  let bg = 'bg-slate-900 border-slate-700 text-white';
  let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

  if (notif.type === 'success') {
    bg = 'bg-emerald-950/90 border-emerald-600/50 text-emerald-100';
    icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
  } else if (notif.type === 'warning') {
    bg = 'bg-amber-950/90 border-amber-500/50 text-amber-100';
    icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
  } else if (notif.type === 'danger') {
    bg = 'bg-rose-950/90 border-rose-600/50 text-rose-100';
    icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={`p-3.5 rounded-xl border backdrop-blur-md shadow-xl flex items-start gap-3 pointer-events-auto transition-all ${bg}`}
    >
      {icon}
      <div className="flex-1 text-xs">
        <div className="font-semibold text-sm mb-0.5 flex justify-between items-center">
          <span>{notif.title}</span>
          <span className="text-[10px] opacity-60 font-mono pl-2">{notif.timestamp}</span>
        </div>
        <p className="opacity-90 leading-relaxed">{notif.message}</p>
      </div>
      <button
        onClick={() => onDismiss(notif.id)}
        className="p-1 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.slice(0, 4).map(notif => (
          <ToastItem key={notif.id} notif={notif} onDismiss={dismissNotification} />
        ))}
      </AnimatePresence>
    </div>
  );
};
