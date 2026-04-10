import React from 'react';

const ProgressBar = ({ progress, showPercentage = true, size = 'medium', color = 'blue' }) => {
  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  };

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="w-full">
      {showPercentage && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          <div className="h-full bg-white bg-opacity-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;