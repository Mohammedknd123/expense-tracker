import React from 'react';
import { cn } from '../../utils/cn';

const Button = ({ className, variant = 'primary', size = 'md', children, ...props }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-slate-800 dark:bg-neon-blue dark:text-black dark:font-bold dark:neon-glow-blue',
    secondary: 'bg-secondary text-white hover:bg-blue-800 dark:bg-neon-blue dark:text-black dark:font-bold dark:neon-glow-blue',
    neon: 'bg-secondary text-white shadow-lg dark:bg-neon-blue dark:text-black font-bold dark:neon-glow-blue hover:scale-105 active:scale-95',
    'neon-green': 'bg-[#10b981] text-white dark:bg-[#00ff88] dark:text-black font-bold shadow-md dark:neon-glow-green hover:scale-105 active:scale-95',
    'neon-red': 'bg-[#ef4444] text-white dark:bg-[#ff0055] dark:text-white font-bold shadow-md dark:neon-glow-red hover:scale-105 active:scale-95',
    'neon-purple': 'bg-[#a855f7] text-white dark:bg-[#b026ff] dark:text-white font-bold shadow-md dark:neon-glow-purple hover:scale-105 active:scale-95',
    outline: 'border-2 border-slate-200 text-primary hover:bg-slate-50 dark:text-neon-blue dark:border-neon-blue/30 dark:hover:bg-neon-blue/5',
    ghost: 'text-primary hover:bg-slate-100 dark:text-neon-blue/70 dark:hover:text-neon-blue dark:hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
