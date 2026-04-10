import React, { useState } from 'react';
import { Star, Clock, Users, Play, Heart, Share2, TrendingUp, Award, BookOpen, Eye, ShoppingCart } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import useCourseStore from '../store/courseStore';
import Button from './ui/Button';
import Card from './ui/Card';

const CourseCard = ({ course, viewMode = 'grid', onEnroll, onPreview }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver();
  
  const { favorites, toggleFavorite, enrolledCourses } = useCourseStore();
  
  const isEnrolled = enrolledCourses.includes(course.id);
  const isFavorite = favorites.includes(course.id);
  const isPopular = course.enrolled > 1000;
  const isHighRated = parseFloat(course.rating) >= 4.5;

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(course.id);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: course.desc,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const cardClasses = `group cursor-pointer card-hover ${viewMode === 'list' ? 'flex' : ''}`;
  const imageClasses = `relative overflow-hidden rounded-t-2xl ${viewMode === 'list' ? 'w-64 h-40 flex-shrink-0 rounded-l-2xl rounded-t-none' : 'h-56'}`;

  return (
    <div 
      ref={elementRef} 
      className={`${cardClasses} glass-card rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-500 border border-white/20`} 
      onClick={() => onPreview?.(course)}
    >
      {/* Image Section */}
      <div className={imageClasses}>
        {hasIntersected && (
          <>
            {!imageError ? (
              <>
                <img 
                  src={course.img} 
                  alt={course.title}
                  className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 animate-shimmer">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-3">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-600 text-center px-4">
                  {course.title.split(' ').slice(0, 2).join(' ')}
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Enhanced Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {course.progress > 0 && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl backdrop-blur-md border border-white/20 animate-pulse">
              {course.progress}% Complete
            </div>
          )}
          {isEnrolled && (
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl backdrop-blur-md border border-white/20">
              ✓ Enrolled
            </div>
          )}
          {isPopular && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center backdrop-blur-md border border-white/20 animate-glow">
              <TrendingUp className="w-3 h-3 mr-1" />
              Popular
            </div>
          )}
          {isHighRated && (
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center backdrop-blur-md border border-white/20">
              <Award className="w-3 h-3 mr-1" />
              Top Rated
            </div>
          )}
        </div>
        
        {/* Enhanced Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-xl border border-white/20">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {course.rating}
          </div>
          <button
            onClick={handleFavoriteClick}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-xl border border-white/20 hover:scale-110 ${
              isFavorite 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current animate-pulse' : ''}`} />
          </button>
        </div>
        
        {/* Enhanced Hover Actions */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview?.(course);
              }}
              className="flex-1 bg-white/95 backdrop-blur-md text-gray-900 hover:bg-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl border border-white/20 flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button 
              onClick={handleShareClick}
              className="bg-white/20 backdrop-blur-md text-white p-2.5 rounded-xl hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-xl border border-white/20"
              aria-label="Share course"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:gradient-text transition-all duration-300 line-clamp-2 leading-tight">
            {course.title}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {course.desc}
        </p>
        
        {/* Enhanced Course Meta */}
        <div className="flex items-center justify-between mb-6 text-xs text-gray-500 flex-wrap gap-3">
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1.5 rounded-xl font-semibold border-2 ${getLevelColor(course.level)} transition-all duration-300 hover:scale-105`}>
              {course.level}
            </span>
            <span className="flex items-center bg-gray-100 px-3 py-1.5 rounded-xl font-medium">
              <Clock className="w-3 h-3 mr-1.5 text-blue-500" />
              {course.time}
            </span>
            <span className="flex items-center bg-gray-100 px-3 py-1.5 rounded-xl font-medium">
              <Users className="w-3 h-3 mr-1.5 text-green-500" />
              {course.enrolled?.toLocaleString() || 0}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        {course.progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Enhanced Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs font-bold">{course.instructor.charAt(0)}</span>
              </div>
              {course.instructor}
            </div>
            <div className="text-2xl font-bold gradient-text">
              ₹{course.price?.toLocaleString() || 0}
            </div>
          </div>
          
          {isEnrolled ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                alert('🎉 Welcome to your course! Course content will be available here.');
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <Play className="w-4 h-4" />
              <span>Continue</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEnroll?.(course);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Enroll Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;