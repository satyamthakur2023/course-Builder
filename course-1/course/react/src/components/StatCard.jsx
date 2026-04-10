import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue', 
  trend, 
  trendDirection = 'up',
  description,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 text-blue-100',
    green: 'from-green-500 to-green-600 text-green-100',
    purple: 'from-purple-500 to-purple-600 text-purple-100',
    orange: 'from-orange-500 to-orange-600 text-orange-100',
    red: 'from-red-500 to-red-600 text-red-100',
    indigo: 'from-indigo-500 to-indigo-600 text-indigo-100'
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
        )}
        {trend && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            trendDirection === 'up' ? 'text-green-200' : 'text-red-200'
          }`}>
            {trendDirection === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-3xl font-bold">
          {prefix}{formatValue(value)}{suffix}
        </div>
        <div className="text-sm opacity-90 font-medium">
          {title}
        </div>
        {description && (
          <div className="text-xs opacity-75">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;