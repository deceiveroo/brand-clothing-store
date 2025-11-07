'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { useEffect } from 'react';

interface NotificationProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Notification({ 
  type, 
  message, 
  isVisible, 
  onClose, 
  duration = 5000 
}: NotificationProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
  };

  const colors = {
    success: 'bg-emerald-500 border-emerald-400',
    error: 'bg-rose-500 border-rose-400',
    warning: 'bg-amber-500 border-amber-400',
  };

  const Icon = icons[type];

  // Автоматическое закрытие уведомления
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30 
          }}
          className={`
            fixed top-4 right-4 z-50 
            ${colors[type]} 
            text-white p-4 rounded-2xl 
            shadow-2xl max-w-sm 
            backdrop-blur-lg bg-opacity-95
            border
          `}
        >
          <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm leading-relaxed break-words">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Progress bar */}
          {duration > 0 && (
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left rounded-b-2xl"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}