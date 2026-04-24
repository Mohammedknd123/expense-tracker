import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const Card = ({ className, children, animate = true, ...props }) => {
  return (
    <motion.div
      whileHover={animate ? { scale: 1.01, translateY: -4 } : {}}
      className={cn(
        'bg-[var(--card-bg)] rounded-xl border border-surface-container card-shadow p-6 transition-all duration-300 dark:border-white/5 neon-border-glow',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
