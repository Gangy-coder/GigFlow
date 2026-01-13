import React from 'react';

const LoadingSpinner = ({ size = 'lg', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8', 
    lg: 'w-14 h-14'
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-slate-200/50 border-t-blue-600/80 rounded-full animate-spin shadow-lg`}></div>
        <div className="absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full animate-spin-slow shadow-xl blur-sm opacity-75"></div>
      </div>
      {text && (
        <p className="text-lg font-medium text-slate-600 tracking-wide animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
