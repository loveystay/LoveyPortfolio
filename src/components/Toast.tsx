import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-neutral-950 px-5 py-3.5 text-xs font-semibold text-white shadow-2xl border border-neutral-800"
        >
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{message}</span>
          <button
            onClick={onClose}
            className="ml-2 text-neutral-400 hover:text-white"
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
