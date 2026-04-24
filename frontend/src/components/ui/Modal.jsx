import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Card from './Card';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg z-10"
        >
          <Card className="p-0 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-surface-container bg-surface">
              <h3 className="text-xl font-bold text-primary">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 text-primary/40 hover:text-primary hover:bg-surface-container rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {children}
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;
