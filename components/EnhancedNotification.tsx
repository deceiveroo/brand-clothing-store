'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X, ShoppingCart, Package, Info } from 'lucide-react';
import { useEffect } from 'react';

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
    info: Info,
    cart: ShoppingCart,
    order: Package,
  };

  const colors = {
    success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400',
    error: 'bg-gradient-to-r from-rose-500 to-rose-600 border-rose-400',
    warning: 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400',
    info: 'bg-gradient-to-r from-cyan-500 to-cyan-600 border-cyan-400',
    cart: 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400',
    order: 'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400',
  };

  const Icon = icons[type];

  // Автоматическое закрытие
  useEffect(() => {
    if (isVisible && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, onClose]);

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
            <div className="flex-shrink-0">
              <Icon className="w-6 h-6 mt-0.5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white mb-1 text-base">{title}</h4>
              <p className="text-white/90 text-sm leading-relaxed break-words">{message}</p>
              
              {action && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.onClick}
                  className="mt-3 px-4 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition-all duration-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  {action.label}
                </motion.button>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
          
          {/* Progress bar */}
          {autoClose > 0 && (
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: autoClose / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left rounded-b-2xl"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}