import React, { useState } from 'react';
import { Star, Clock, Users, Play, Heart, Share2, TrendingUp, Award, BookOpen, Eye, ShoppingCart, Zap, CheckCircle } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import useCourseStore from '../store/courseStore';

const CourseCard = ({ course, viewMode = 'grid', onEnroll, onPreview }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver();
  const { favorites, toggleFavorite, enrolledCourses } = useCourseStore();

  const isEnrolled = enrolledCourses.includes(course.id);
  const isFavorite = favorites.includes(course.id);
  const isPopular = course.enrolled > 1000;
  const isHighRated = parseFloat(course.rating) >= 4.8;
  const isFree = course.price === 0;
  const totalLessons = (course.freeContent?.length || 0) + (course.paidContent?.length || 0);

  const levelColor = {
    Beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Intermediate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
  }[course.level] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

  const catColor = {
    development: 'bg-blue-500/20 text-blue-400',
    design: 'bg-pink-500/20 text-pink-400',
    business: 'bg-green-500/20 text-green-400',
    ai: 'bg-purple-500/20 text-purple-400',
  }[course.cat] || 'bg-gray-500/20 text-gray-400';

  if (viewMode === 'list') {
    return (
      <div
        ref={elementRef}
        onClick={() => onPreview?.(course)}
        className="group flex bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-400 border border-gray-100 dark:border-gray-700 cursor-pointer hover:-translate-y-1"
      >
        {/* Thumbnail */}
        <div className="relative w-56 flex-shrink-0 overflow-hidden">
          {hasIntersected && !imageError ? (
            <img
              src={course.img}
              alt={course.title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-blue-400" />
            </div>
          )}
          {isFree && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">FREE</div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${catColor}`}>{course.cat}</span>
              <span className={`text-xs px-2 py-0.5 rounded-lg font-medium border ${levelColor}`}>{course.level}</span>
            </div>
            <h3 className="text-gray-900 dark:text-white font-bold text-base mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{course.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">{course.desc}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center"><Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />{course.rating}</span>
              <span className="flex items-center"><Users className="w-3 h-3 mr-1 text-green-500" />{course.enrolled?.toLocaleString()}</span>
              <span className="flex items-center"><Clock className="w-3 h-3 mr-1 text-blue-500" />{course.time}</span>
              <span className="flex items-center"><BookOpen className="w-3 h-3 mr-1 text-purple-500" />{totalLessons} lessons</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              <div className="text-xs text-gray-500">by {course.instructor}</div>
              <div className="text-lg font-bold text-blue-600">{isFree ? 'Free' : `₹${course.price?.toLocaleString()}`}</div>
            </div>
            {isEnrolled ? (
              <button onClick={e => { e.stopPropagation(); onPreview?.(course); }} className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-1">
                <Play className="w-3.5 h-3.5" /><span>Continue</span>
              </button>
            ) : (
              <button onClick={e => { e.stopPropagation(); onEnroll?.(course); }} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all hover:scale-105">
                Enroll Now
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={elementRef}
      className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-soft hover:shadow-strong transition-all duration-400 border border-gray-100 dark:border-gray-700 hover:-translate-y-2 hover:scale-[1.02] flex flex-col"
      onClick={() => onPreview?.(course)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        {hasIntersected && (
          <>
            {!imageError ? (
              <img
                src={course.img}
                alt={course.title}
                className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-2">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <p className="text-xs text-gray-500 text-center px-4 line-clamp-2">{course.title}</p>
              </div>
            )}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 animate-shimmer" />
            )}
          </>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400" />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1.5">
          {isFree && (
            <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">FREE</span>
          )}
          {isEnrolled && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" /><span>Enrolled</span>
            </span>
          )}
          {isPopular && !isEnrolled && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" /><span>Popular</span>
            </span>
          )}
          {isHighRated && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center space-x-1">
              <Award className="w-3 h-3" /><span>Top Rated</span>
            </span>
          )}
        </div>

        {/* Top-right: rating + favorite */}
        <div className="absolute top-3 right-3 flex flex-col space-y-1.5 items-end">
          <div className="bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); toggleFavorite(course.id); }}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Hover actions */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0 flex space-x-2">
          <button
            onClick={e => { e.stopPropagation(); onPreview?.(course); }}
            className="flex-1 bg-white/95 backdrop-blur-md text-gray-900 font-semibold py-2 px-3 rounded-xl text-xs transition-all hover:bg-white flex items-center justify-center space-x-1 shadow-lg"
          >
            <Eye className="w-3.5 h-3.5" /><span>Preview</span>
          </button>
          <button
            onClick={e => { e.stopPropagation(); navigator.clipboard?.writeText(window.location.href); }}
            className="bg-white/20 backdrop-blur-md text-white p-2 rounded-xl hover:bg-white/30 transition-all shadow-lg"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category + Level */}
        <div className="flex items-center space-x-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${catColor}`}>{course.cat}</span>
          <span className={`text-xs px-2 py-0.5 rounded-lg font-medium border ${levelColor}`}>{course.level}</span>
        </div>

        {/* Title */}
        <h3 className="text-gray-900 dark:text-white font-bold text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {course.title}
        </h3>

        {/* Desc */}
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed flex-1">
          {course.desc}
        </p>

        {/* Meta row */}
        <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center"><Clock className="w-3 h-3 mr-1 text-blue-400" />{course.time}</span>
          <span className="flex items-center"><Users className="w-3 h-3 mr-1 text-green-400" />{course.enrolled?.toLocaleString()}</span>
          <span className="flex items-center"><BookOpen className="w-3 h-3 mr-1 text-purple-400" />{totalLessons} lessons</span>
        </div>

        {/* Progress bar */}
        {course.progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span><span className="text-blue-500 font-medium">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }} />
            </div>
          </div>
        )}

        {/* Skill tags */}
        {course.freeContent?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {course.freeContent.slice(0, 2).map((tag, i) => (
              <span key={i} className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-lg">
                {tag}
              </span>
            ))}
            {totalLessons > 2 && (
              <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-500 text-xs px-2 py-0.5 rounded-lg">
                +{totalLessons - 2} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
          <div>
            <div className="flex items-center space-x-1.5 mb-0.5">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{course.instructor?.charAt(0)}</span>
              </div>
              <span className="text-xs text-gray-500 truncate max-w-[80px]">{course.instructor}</span>
            </div>
            <div className={`text-base font-bold ${isFree ? 'text-green-500' : 'text-blue-600'}`}>
              {isFree ? 'Free' : `₹${course.price?.toLocaleString()}`}
            </div>
          </div>

          {isEnrolled ? (
            <button
              onClick={e => { e.stopPropagation(); onPreview?.(course); }}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-2 px-4 rounded-xl transition-all hover:scale-105 shadow-md text-xs flex items-center space-x-1"
            >
              <Play className="w-3.5 h-3.5" /><span>Continue</span>
            </button>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); onEnroll?.(course); }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-xl transition-all hover:scale-105 shadow-md text-xs flex items-center space-x-1"
            >
              <ShoppingCart className="w-3.5 h-3.5" /><span>Enroll</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
