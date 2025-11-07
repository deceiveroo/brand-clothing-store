'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X, ShoppingCart, Package } from 'lucide-react';

interface EnhancedNotificationProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'cart' | 'order';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  isVisible: boolean;
  onClose: () => void;
  autoClose?: number;
}

export default function EnhancedNotification({
  type,
  title,
  message,
  action,
  isVisible,
  onClose,
  autoClose = 5000
}: EnhancedNotificationProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: AlertCircle,
    cart: ShoppingCart,
    order: Package,
  };

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-cyan-500',
    cart: 'bg-blue-500',
    order: 'bg-purple-500',
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          className={`fixed top-4 right-4 ${colors[type]} text-white p-4 rounded-2xl shadow-2xl max-w-sm z-50 backdrop-blur-lg bg-opacity-90 border border-white/20`}
        >
          <div className="flex items-start gap-3">
            <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white mb-1">{title}</h4>
              <p className="text-white/90 text-sm leading-relaxed">{message}</p>
              {action && (
                <button
                  onClick={action.onClick}
                  className="mt-2 px-3 py-1 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                >
                  {action.label}
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Progress bar */}
          {autoClose > 0 && (
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: autoClose / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}