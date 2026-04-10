import React, { useState, useMemo, useEffect } from 'react';
import { Award, Play, Bookmark, X, Video } from 'lucide-react';
import CourseCard from './components/CourseCard.jsx';
import CourseViewer from './components/CourseViewer.jsx';
import UnifiedSearch from './components/UnifiedSearch.jsx';
import StatCard from './components/StatCard.jsx';
import PaymentModal from './components/PaymentModal.jsx';
import { sortCourses } from './utils/courseUtils';
import useCourseStore from './store/courseStore';
import useAuthStore from './store/authStore';
import { useToast } from './components/Toast.jsx';

const Course = ({ courses }) => {
  console.log('Course component received', courses?.length || 0, 'courses');
  const { showToast } = useToast();
  const { enrollInCourse, getStats, enrolledCourses } = useCourseStore();
  const { user } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkMode);
  }, []);
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewerCourse, setViewerCourse] = useState(null);
  const [paymentCourse, setPaymentCourse] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: 'all', priceRange: [0, 500], rating: 0 });
  const [sortBy, setSortBy] = useState('rating');

  const stats = getStats();
  const filteredCourses = useMemo(() => {
    const filtered = courses.filter(course => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        course.title.toLowerCase().includes(searchLower) || 
        course.instructor.toLowerCase().includes(searchLower);
      const matchesCategory = filters.category === 'all' || course.cat === filters.category;
      const matchesPrice = (course.price || 0) >= filters.priceRange[0] && 
        (course.price || 0) <= filters.priceRange[1];
      const matchesRating = parseFloat(course.rating || 0) >= filters.rating;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
    const sorted = sortCourses(filtered, sortBy);
    console.log('Filtered courses:', sorted.length, 'out of', courses?.length || 0);
    return sorted;
  }, [courses, searchTerm, filters, sortBy]);

  const handleEnroll = (course) => {
    if (enrolledCourses.includes(course.id)) {
      showToast('Already enrolled in this course', 'info');
      return;
    }
    setPaymentCourse(course);
  };

  const handleCourseView = (course) => {
    setViewerCourse(course);
  };

  const handlePaymentSuccess = (course, email) => {
    enrollInCourse(course.id);
    showToast(`Enrolled in ${course.title}!`, 'success');
    setTimeout(() => showToast(`Confirmation sent to ${email}`, 'info'), 1000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30'
    }`}>
      {/* Hero Section */}
      <section className={`pt-20 pb-24 relative overflow-hidden transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-soft animate-fadeIn transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-blue-300 border border-blue-700/30' 
              : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700'
          }`}>
            <Award className="w-5 h-5 mr-2 animate-pulse" />
            <span className={isDarkMode ? 'text-blue-300' : 'gradient-text'}>#1 Learning Platform</span>
          </div>
          
          <h1 className={`text-fluid-4xl font-display font-bold mb-8 animate-slideUp transition-colors duration-300 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {user?.role === 'instructor' ? (
              <>Teach & <span className="gradient-text-secondary">Inspire</span></>
            ) : (
              <>Learn Without <span className="gradient-text">Limits</span></>
            )}
          </h1>
          <p className={`text-fluid-lg mb-12 max-w-4xl mx-auto leading-relaxed animate-slideUp transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`} style={{animationDelay: '0.2s'}}>
            {user?.role === 'instructor' 
              ? `Share your expertise with ${courses.length} premium courses and help students achieve their goals. Build your teaching empire today.`
              : `Start, switch, or advance your career with ${courses.length} world-class courses from industry experts. Your future starts here.`
            }
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 animate-slideUp" style={{animationDelay: '0.4s'}}>
            <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{courses?.length || 0}</div>
              <div className="text-sm text-gray-600 font-medium">Total Courses</div>
            </div>
            
            <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalStudents.toLocaleString()}</div>
              <div className="text-sm text-gray-600 font-medium">Active Students</div>
            </div>
            
            <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{parseFloat(stats.avgRating).toFixed(1)}</div>
              <div className="text-sm text-gray-600 font-medium">Avg Rating</div>
            </div>
            
            <div className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stats.categories}</div>
              <div className="text-sm text-gray-600 font-medium">Categories</div>
            </div>
          </div>
          
          <div className="animate-slideUp space-y-4" style={{animationDelay: '0.6s'}}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  if (user?.role === 'instructor') {
                    const instructorButton = document.querySelector('button[onclick*="instructor"]') || 
                      Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Instructor Panel'));
                    if (instructorButton) {
                      instructorButton.click();
                      setTimeout(() => {
                        const addButton = document.querySelector('[data-add-course]');
                        if (addButton) addButton.click();
                      }, 200);
                    }
                  } else {
                    document.querySelector('.course-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`group relative overflow-hidden ${user?.role === 'instructor' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/25' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-500/25'} text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl cursor-pointer`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>{user?.role === 'instructor' ? 'Create Your First Course' : 'Start Learning Today'}</span>
                  <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
              
              <button 
                onClick={() => {
                  // Show first course with video as demo
                  const courseWithVideo = courses.find(c => c.hasVideo);
                  if (courseWithVideo) {
                    setViewerCourse(courseWithVideo);
                  }
                }}
                className="group bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl cursor-pointer hover:bg-white/20"
              >
                <span className="flex items-center space-x-2">
                  <Video className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Watch Demo</span>
                </span>
              </button>
            </div>
            
            <p className={`text-sm mt-4 animate-pulse transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {user?.role === 'instructor' ? 'Join 10,000+ successful instructors' : 'Join 50,000+ successful learners'}
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <UnifiedSearch onSearch={setSearchTerm} onFilter={setFilters} onSort={setSortBy} onViewChange={setViewMode} viewMode={viewMode} />

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 course-grid">
        <div className="mb-8 text-center">
          <h2 className={`text-3xl font-bold mb-4 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>Explore Our Courses</h2>
          <p className={`max-w-2xl mx-auto transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Discover world-class courses designed by industry experts to accelerate your career growth</p>
        </div>
        
        {filteredCourses.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' : 'space-y-8'}>
            {filteredCourses.map((course, index) => (
              <div 
                key={course.id} 
                className="animate-fadeIn" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CourseCard 
                  course={course} 
                  viewMode={viewMode} 
                  onEnroll={handleEnroll} 
                  onPreview={handleCourseView} 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-16 h-16 text-blue-500" />
            </div>
            <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>No courses found</h3>
            <p className={`mb-6 max-w-md mx-auto transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>We couldn't find any courses matching your criteria. Try adjusting your search or filters.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilters({ category: 'all', priceRange: [0, 500], rating: 0 });
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Course Preview Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="glass-card rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn">
            <div className="relative">
              <img 
                className="w-full h-80 object-cover" 
                src={selectedCourse.img} 
                alt={selectedCourse.title}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=320&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <button 
                onClick={() => setSelectedCourse(null)} 
                className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCourse.level}
                  </span>
                  <span className="bg-yellow-500/90 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    ⭐ {selectedCourse.rating}
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-2">{selectedCourse.title}</h2>
                <p className="text-white/90">by {selectedCourse.instructor}</p>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">{selectedCourse.desc}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{selectedCourse.time}</div>
                      <div className="text-sm text-gray-600">Duration</div>
                    </div>
                    <div className="glass p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{selectedCourse.enrolled?.toLocaleString() || 0}</div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="glass p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">{selectedCourse.level}</div>
                      <div className="text-sm text-gray-600">Level</div>
                    </div>
                    <div className="glass p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-orange-600 mb-1">{selectedCourse.rating}</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-8 text-right">
                  <div className="text-4xl font-bold gradient-text mb-2">₹{selectedCourse.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">One-time payment</div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleEnroll(selectedCourse)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Enroll Now</span>
                  <Play className="w-5 h-5" />
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center">
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="bg-green-100 hover:bg-green-200 text-green-700 px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center">
                  <Play className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Course Viewer Modal */}
      {viewerCourse && (
        <CourseViewer 
          course={viewerCourse} 
          isEnrolled={enrolledCourses.includes(viewerCourse.id)}
          onClose={() => setViewerCourse(null)} 
          onEnroll={handleEnroll}
        />
      )}
      
      {paymentCourse && <PaymentModal course={paymentCourse} onClose={() => setPaymentCourse(null)} onPaymentSuccess={handlePaymentSuccess} />}
    </div>
  );
};

export default Course;