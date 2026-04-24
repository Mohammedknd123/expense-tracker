import React from 'react';
import { cn } from '../../utils/cn';

const Input = ({ className, label, error, ...props }) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-primary/80 dark:text-white/80 ml-1">
          {label}
        </label>
      )}
      <input
        className={cn(
          'flex h-11 w-full rounded-lg border border-surface-container dark:border-white/10 bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--input-text)] ring-offset-white placeholder:text-[var(--input-placeholder)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary dark:focus-visible:ring-neon-blue transition-all',
          error && 'border-neon-red dark:border-neon-red focus-visible:ring-neon-red',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-neon-red mt-1 ml-1 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;
