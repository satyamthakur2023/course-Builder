import React, { useState, useMemo, useEffect } from 'react';
import { Award, Play, Bookmark, X, Video, TrendingUp, Zap, BookOpen, Star, Users, Clock, ChevronRight, Filter } from 'lucide-react';
import CourseCard from './components/CourseCard.jsx';
import CourseViewer from './components/CourseViewer.jsx';
import UnifiedSearch from './components/UnifiedSearch.jsx';
import PaymentModal from './components/PaymentModal.jsx';
import { sortCourses } from './utils/courseUtils';
import useCourseStore from './store/courseStore';
import useAuthStore from './store/authStore';
import { useToast } from './components/Toast.jsx';

const CATEGORIES = [
  { value: 'all', label: 'All', icon: '🌐' },
  { value: 'development', label: 'Development', icon: '💻' },
  { value: 'design', label: 'Design', icon: '🎨' },
  { value: 'business', label: 'Business', icon: '📈' },
  { value: 'ai', label: 'AI & ML', icon: '🤖' },
];

const Course = ({ courses }) => {
  const { showToast } = useToast();
  const { enrollInCourse, getStats, enrolledCourses } = useCourseStore();
  const { user } = useAuthStore();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewerCourse, setViewerCourse] = useState(null);
  const [paymentCourse, setPaymentCourse] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: 'all', priceRange: [0, 500], rating: 0 });
  const [sortBy, setSortBy] = useState('rating');
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount] = useState(12);

  const stats = getStats();

  useEffect(() => {
    const dark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(dark);
  }, []);

  // Featured course — highest rated with video
  const featuredCourse = useMemo(() =>
    [...courses].filter(c => c.hasVideo).sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))[0],
    [courses]
  );

  const filteredCourses = useMemo(() => {
    const cat = activeCategory !== 'all' ? activeCategory : filters.category;
    const filtered = courses.filter(course => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        course.title.toLowerCase().includes(searchLower) ||
        course.instructor.toLowerCase().includes(searchLower) ||
        course.desc?.toLowerCase().includes(searchLower);
      const matchesCategory = cat === 'all' || course.cat === cat;
      const matchesPrice = (course.price || 0) >= filters.priceRange[0] && (course.price || 0) <= filters.priceRange[1];
      const matchesRating = parseFloat(course.rating || 0) >= filters.rating;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
    return sortCourses(filtered, sortBy);
  }, [courses, searchTerm, filters, sortBy, activeCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: courses.length };
    courses.forEach(c => { counts[c.cat] = (counts[c.cat] || 0) + 1; });
    return counts;
  }, [courses]);

  const handleEnroll = (course) => {
    if (enrolledCourses.includes(course.id)) {
      showToast('Already enrolled in this course', 'info');
      return;
    }
    setPaymentCourse(course);
  };

  const handlePaymentSuccess = (course, email) => {
    enrollInCourse(course.id);
    showToast(`🎉 Enrolled in ${course.title}!`, 'success');
    setTimeout(() => showToast(`📧 Confirmation sent to ${email}`, 'info'), 1000);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(12);
  };

  const bg = isDarkMode
    ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20'
    : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30';

  const text = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const subtext = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-white/20';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${bg}`}>

      {/* ── Hero ── */}
      <section className={`pt-16 pb-20 relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30' : 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700'}`}>
        {/* Blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
              <Zap className="w-4 h-4 mr-2 text-yellow-300" />
              {user?.role === 'instructor' ? 'Instructor Dashboard' : '#1 Learning Platform'}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              {user?.role === 'instructor' ? (
                <>Teach & <span className="text-yellow-300">Inspire</span></>
              ) : (
                <>Learn Without <span className="text-yellow-300">Limits</span></>
              )}
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
              {user?.role === 'instructor'
                ? `Manage ${courses.length} courses and grow your teaching empire.`
                : `${courses.length} world-class courses from industry experts. Start today.`}
            </p>

            {/* Hero stats */}
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: BookOpen, label: 'Courses', value: courses.length, color: 'text-blue-200' },
                { icon: Users, label: 'Students', value: stats.totalStudents.toLocaleString(), color: 'text-green-300' },
                { icon: Star, label: 'Avg Rating', value: parseFloat(stats.avgRating).toFixed(1), color: 'text-yellow-300' },
                { icon: Award, label: 'Categories', value: stats.categories, color: 'text-pink-300' },
              ].map((s, i) => (
                <div key={i} className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span className="text-white font-bold">{s.value}</span>
                  <span className="text-blue-200 text-sm">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Course Banner */}
          {featuredCourse && (
            <div
              onClick={() => setViewerCourse(featuredCourse)}
              className="group cursor-pointer max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-400 hover:scale-[1.01] shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative sm:w-64 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                  <img
                    src={featuredCourse.img}
                    alt={featuredCourse.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop'}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-blue-600 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" /><span>Featured</span>
                  </div>
                </div>
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Course of the Week</p>
                    <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2">{featuredCourse.title}</h3>
                    <p className="text-blue-100/80 text-sm line-clamp-2 mb-3">{featuredCourse.desc}</p>
                    <div className="flex items-center space-x-4 text-xs text-blue-200">
                      <span className="flex items-center"><Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />{featuredCourse.rating}</span>
                      <span className="flex items-center"><Users className="w-3 h-3 mr-1" />{featuredCourse.enrolled?.toLocaleString()}</span>
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{featuredCourse.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-white font-bold text-xl">
                      {featuredCourse.price === 0 ? 'Free' : `₹${featuredCourse.price?.toLocaleString()}`}
                    </div>
                    <div className="flex items-center text-yellow-300 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      View Course <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Search & Filters ── */}
      <UnifiedSearch
        onSearch={setSearchTerm}
        onFilter={setFilters}
        onSort={setSortBy}
        onViewChange={setViewMode}
        viewMode={viewMode}
      />

      {/* ── Category Pills ── */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => {
            const count = categoryCounts[cat.value] || 0;
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all duration-300 hover:scale-105 flex-shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                      : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200 shadow-soft'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Course Grid ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${text}`}>
              {activeCategory === 'all' ? 'All Courses' : CATEGORIES.find(c => c.value === activeCategory)?.label}
            </h2>
            <p className={`text-sm mt-0.5 ${subtext} flex items-center space-x-1`}>
              <Filter className="w-3.5 h-3.5" />
              <span>
                Showing <span className="font-semibold text-blue-500">{Math.min(visibleCount, filteredCourses.length)}</span> of <span className="font-semibold">{filteredCourses.length}</span> courses
              </span>
            </p>
          </div>
          {filteredCourses.length > 0 && (
            <div className={`text-xs px-3 py-1.5 rounded-full font-medium ${isDarkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>
              {sortBy === 'rating' ? '⭐ Top Rated' : sortBy === 'enrolled' ? '🔥 Most Popular' : sortBy === 'price' ? '💰 Price' : '🆕 Newest'}
            </div>
          )}
        </div>

        {filteredCourses.length > 0 ? (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {filteredCourses.slice(0, visibleCount).map((course, index) => (
                <div key={course.id} className="animate-fadeIn" style={{ animationDelay: `${(index % 12) * 0.05}s` }}>
                  <CourseCard
                    course={course}
                    viewMode={viewMode}
                    onEnroll={handleEnroll}
                    onPreview={setViewerCourse}
                  />
                </div>
              ))}
            </div>

            {/* Load more */}
            {visibleCount < filteredCourses.length && (
              <div className="text-center mt-10">
                <p className={`text-sm mb-4 ${subtext}`}>
                  Showing {visibleCount} of {filteredCourses.length} courses
                </p>
                <button
                  onClick={() => setVisibleCount(v => v + 12)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
                >
                  Load More Courses
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${text}`}>No courses found</h3>
            <p className={`mb-6 max-w-sm mx-auto text-sm ${subtext}`}>
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setFilters({ category: 'all', priceRange: [0, 500], rating: 0 }); setActiveCategory('all'); }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all hover:scale-105"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {viewerCourse && (
        <CourseViewer
          course={viewerCourse}
          isEnrolled={enrolledCourses.includes(viewerCourse.id)}
          onClose={() => setViewerCourse(null)}
          onEnroll={handleEnroll}
        />
      )}
      {paymentCourse && (
        <PaymentModal
          course={paymentCourse}
          onClose={() => setPaymentCourse(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default Course;
