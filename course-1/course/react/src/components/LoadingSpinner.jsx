import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = '', 
  color = 'blue',
  overlay = false,
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-12 h-12';
      case 'xl':
        return 'w-16 h-16';
      default:
        return 'w-8 h-8';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'white':
        return 'border-white/30 border-t-white';
      case 'gray':
        return 'border-gray-300 border-t-gray-600';
      case 'green':
        return 'border-green-200 border-t-green-600';
      case 'red':
        return 'border-red-200 border-t-red-600';
      default:
        return 'border-blue-200 border-t-blue-600';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'large':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      default:
        return 'text-sm';
    }
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div
        className={`
          ${getSizeClasses()} 
          ${getColorClasses()}
          border-2 border-solid rounded-full animate-spin
        `}
      />
      {text && (
        <p className={`${getTextSize()} text-gray-600 font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

// Skeleton loader for better UX
export const SkeletonLoader = ({ className = '', lines = 3 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`
            bg-gray-200 rounded h-4 mb-3
            ${index === 0 ? 'w-3/4' : index === lines - 1 ? 'w-1/2' : 'w-full'}
          `}
        />
      ))}
    </div>
  );
};

// Card skeleton for course cards
export const CourseCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
        <div className="h-4 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded mb-4 w-2/3" />
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-20" />
          <div className="h-10 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;