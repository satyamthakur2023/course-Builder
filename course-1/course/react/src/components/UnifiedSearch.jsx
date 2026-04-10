import React, { useState } from 'react';
import { Search, Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

const UnifiedSearch = ({ onSearch, onFilter, onSort, onViewChange, viewMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 500],
    rating: 0,
    level: 'all'
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      category: 'all',
      priceRange: [0, 500],
      rating: 0,
      level: 'all'
    };
    setFilters(defaultFilters);
    onFilter(defaultFilters);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'ai', label: 'AI & ML' }
  ];

  const levels = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price', label: 'Price: Low to High' },
    { value: 'enrolled', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <div className="glass-nav border-b border-white/20 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Search Bar */}
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex-1 w-full relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-4 text-lg bg-white/80 backdrop-blur-md border-2 border-white/20 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-soft hover:shadow-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    onSearch('');
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${
                showFilters 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25' 
                  : 'bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white border-2 border-white/20 shadow-soft'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
              {(filters.category !== 'all' || filters.level !== 'all' || filters.rating > 0) && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  {Object.values(filters).filter(v => v !== 'all' && v !== 0 && !(Array.isArray(v) && v[0] === 0 && v[1] === 500)).length}
                </span>
              )}
            </button>
            
            <div className="flex bg-white/80 backdrop-blur-md rounded-2xl p-1.5 border-2 border-white/20 shadow-soft">
              <button
                onClick={() => onViewChange('grid')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => onViewChange('list')}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Advanced Filters */}
        {showFilters && (
          <div className="mt-8 glass-card rounded-3xl border-2 border-white/20 shadow-xl animate-slideUp">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold gradient-text">Advanced Filters</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition-colors hover:bg-red-50 rounded-xl"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Enhanced Category Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-4">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border-2 border-white/20 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-soft hover:shadow-medium font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Enhanced Level Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-4">
                    Difficulty Level
                  </label>
                  <select
                    value={filters.level}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border-2 border-white/20 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-soft hover:shadow-medium font-medium"
                  >
                    {levels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                {/* Enhanced Price Range */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-4">
                    Price Range
                  </label>
                  <div className="bg-white/80 backdrop-blur-md border-2 border-white/20 rounded-2xl p-4 shadow-soft">
                    <div className="text-center mb-3">
                      <span className="text-lg font-bold gradient-text">
                        ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                      className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Enhanced Sort Options */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-4">
                    Sort By
                  </label>
                  <select
                    onChange={(e) => onSort(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-md border-2 border-white/20 rounded-2xl focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-soft hover:shadow-medium font-medium"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Enhanced Rating Filter */}
              <div className="mt-8 col-span-full">
                <label className="block text-sm font-bold text-gray-800 mb-6">
                  Minimum Rating
                </label>
                <div className="flex flex-wrap gap-3">
                  {[0, 3, 4, 4.5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('rating', rating)}
                      className={`px-6 py-3 rounded-2xl border-2 transition-all duration-300 hover:scale-105 font-semibold ${
                        filters.rating === rating
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-400 shadow-lg shadow-yellow-400/25'
                          : 'bg-white/80 backdrop-blur-md text-gray-700 border-white/20 hover:border-yellow-400 shadow-soft hover:shadow-medium'
                      }`}
                    >
                      {rating === 0 ? '⭐ Any Rating' : `⭐ ${rating}+ Stars`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedSearch;