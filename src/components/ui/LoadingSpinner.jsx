import React from 'react';
import { Sparkles } from 'lucide-react';

export default function LoadingSpinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {/* Outer ring */}
      <div className="absolute inset-0 border-4 border-gray-100 dark:border-gray-800 rounded-full"></div>

      {/* Spinning segment */}
      <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>

      {/* Inner pulsing icon */}
      <div className="absolute inset-0 flex items-center justify-center animate-pulse">
        <Sparkles
          size={iconSizes[size]}
          className="text-primary-500"
          strokeWidth={2.5}
        />
      </div>
    </div>
  );
}
