import React from 'react';

/**
 * A reusable loading spinner component following the Neural Medix design system.
 */
const LoadingSpinner = ({ size = 'md', color = 'primary', message = 'Processing...' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-16 h-16 border-4',
    lg: 'w-24 h-24 border-8'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className={`${sizeClasses[size]} border-${color} border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(67,243,246,0.6)]`}></div>
      {message && <h2 className="font-headline text-xl text-on-surface animate-pulse">{message}</h2>}
    </div>
  );
};

export default LoadingSpinner;
