import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, X, Plus, Users, Star, DollarSign, BookOpen, TrendingUp, Upload, Image, BarChart3, Calendar, Award, Target, Filter, Search, Grid, List, Settings, Bell, Download, Home, MessageSquare, FileText, CreditCard, User, Play, Pause, SkipForward, Volume2, Bookmark, Share2, ThumbsUp, Clock, Globe, Video, Headphones, Monitor } from 'lucide-react';
import StatCard from './components/StatCard.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { useToast } from './components/Toast';

const InstructorDashboard = ({ courses, onAddCourse, onUpdateCourse, onDeleteCourse }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [localCourses, setLocalCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '', desc: '', price: '', level: 'Beginner', cat: 'development', time: '', instructor: 'Current User',
    thumbnailUrl: '', videoLinks: []
  });

  useEffect(() => {
    setLocalCourses(courses);
  }, [courses]);

  const stats = {
    totalCourses: localCourses.length,
    totalStudents: localCourses.reduce((sum, course) => sum + (course.enrolled || 0), 0),
    totalRevenue: localCourses.reduce((sum, course) => sum + ((course.price || 0) * (course.enrolled || 0)), 0),
    avgRating: localCourses.length > 0 ? (localCourses.reduce((sum, course) => sum + parseFloat(course.rating || 0), 0) / localCourses.length).toFixed(1) : '0.0'
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const filteredCourses = localCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const handleSubmit = async (e, isEdit = false) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.desc || !courseForm.price) return;
    
    setIsLoading(true);
    try {
      const courseData = {
        ...courseForm,
        price: parseInt(courseForm.price),
        img: courseForm.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop'
      };

      if (isEdit && selectedCourse) {
        if (onUpdateCourse) await onUpdateCourse(selectedCourse.id, courseData);
        setLocalCourses(prev => prev.map(course => course.id === selectedCourse.id ? { ...selectedCourse, ...courseData } : course));
        showToast('Course updated successfully!', 'success');
        setShowEditModal(false);
      } else {
        const createdCourse = onAddCourse ? await onAddCourse(courseData) : null;
        const courseToSave = createdCourse || { ...courseData, id: Date.now(), enrolled: 0, rating: '5.0', createdAt: new Date().toISOString() };
        setLocalCourses(prev => [...prev, courseToSave]);
        showToast('Course created successfully!', 'success');
        setShowAddModal(false);
      }
      
      setCourseForm({ title: '', desc: '', price: '', level: 'Beginner', cat: 'development', time: '', instructor: 'Current User', thumbnailUrl: '', videoLinks: [] });
      setSelectedCourse(null);
    } catch (error) {
      showToast(`Failed to ${isEdit ? 'update' : 'create'} course`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const editCourse = (course) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title, desc: course.desc, price: course.price.toString(), level: course.level, 
      cat: course.cat, time: course.time, instructor: course.instructor, thumbnailUrl: course.thumbnailUrl || '', videoLinks: course.videoLinks || []
    });
    setShowEditModal(true);
  };

  const deleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Delete "${courseTitle}"?`)) return;
    try {
      if (onDeleteCourse) await onDeleteCourse(courseId);
      setLocalCourses(prev => prev.filter(course => course.id !== courseId));
      showToast('Course deleted successfully!', 'success');
    } catch (error) {
      showToast('Failed to delete course', 'error');
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl p-8 border border-white/10 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 animate-fadeIn">
                Welcome back, <span className="gradient-text">Instructor!</span>
              </h1>
              <p className="text-slate-300 text-lg animate-slideUp">Ready to inspire and educate your students today?</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{new Date().getDate()}</div>
                <div className="text-sm text-slate-300">{new Date().toLocaleDateString('en-US', { month: 'short' })}</div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-green-400 font-semibold">+12% this month</p>
                  <p className="text-slate-400 text-sm">Student growth</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-blue-400 font-semibold">4.8/5.0 rating</p>
                  <p className="text-slate-400 text-sm">Course quality</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-purple-400 font-semibold">85% completion</p>
                  <p className="text-slate-400 text-sm">Course progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white card-hover transform transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="text-right">
              <span className="text-blue-100 text-sm font-medium">Total</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1 group-hover:scale-105 transition-transform">{stats.totalCourses}</h3>
          <p className="text-blue-100">Courses Created</p>
          <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white/40 rounded-full" style={{width: '75%'}}></div>
          </div>
        </div>
        
        <div className="group bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white card-hover transform transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
              <Users className="w-8 h-8" />
            </div>
            <div className="text-right">
              <span className="text-green-100 text-sm font-medium">Active</span>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1 group-hover:scale-105 transition-transform">{stats.totalStudents.toLocaleString()}</h3>
          <p className="text-green-100">Students Enrolled</p>
          <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white/40 rounded-full" style={{width: '90%'}}></div>
          </div>
        </div>
        
        <div className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white card-hover transform transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
              <DollarSign className="w-8 h-8" />
            </div>
            <div className="text-right">
              <span className="text-purple-100 text-sm font-medium">Revenue</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1 group-hover:scale-105 transition-transform">₹{stats.totalRevenue.toLocaleString()}</h3>
          <p className="text-purple-100">Total Earnings</p>
          <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white/40 rounded-full" style={{width: '65%'}}></div>
          </div>
        </div>
        
        <div className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white card-hover transform transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
              <Star className="w-8 h-8" />
            </div>
            <div className="text-right">
              <span className="text-orange-100 text-sm font-medium">Rating</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-3xl font-bold mb-1 group-hover:scale-105 transition-transform">{stats.avgRating}</h3>
          <p className="text-orange-100">Average Rating</p>
          <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white/40 rounded-full" style={{width: '95%'}}></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Plus, title: 'Create Course', desc: 'Start building your next course', color: 'blue', action: 'Get Started', onClick: () => setShowAddModal(true) },
          { icon: BarChart3, title: 'View Analytics', desc: 'Track your teaching performance', color: 'green', action: 'View Reports', onClick: () => setActiveTab('analytics') },
          { icon: Users, title: 'Manage Students', desc: 'Connect with your learners', color: 'purple', action: 'View Students', onClick: () => setActiveTab('students') }
        ].map((item, idx) => (
          <div key={idx} onClick={item.onClick} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all cursor-pointer card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-br ${item.color === 'blue' ? 'from-blue-500 to-blue-600' : item.color === 'green' ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'} rounded-xl group-hover:scale-110 transition-transform shadow-lg`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`w-3 h-3 ${item.color === 'blue' ? 'bg-blue-400' : item.color === 'green' ? 'bg-green-400' : 'bg-purple-400'} rounded-full opacity-60 group-hover:opacity-100 transition-opacity`}></div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">{item.title}</h3>
            <p className="text-slate-300 text-sm mb-4 group-hover:text-slate-200 transition-colors">{item.desc}</p>
            <button className={`w-full bg-gradient-to-r ${item.color === 'blue' ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' : item.color === 'green' ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'} text-white py-3 rounded-xl font-medium transition-all transform group-hover:scale-105 shadow-lg btn-hover-lift`}>
              {item.action}
            </button>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">View All</button>
        </div>
        <div className="space-y-4">
          {[
            { icon: BookOpen, text: 'New course "Advanced React" published', time: '2 hours ago', color: 'blue' },
            { icon: Users, text: '5 new students enrolled in your courses', time: '4 hours ago', color: 'green' },
            { icon: Star, text: 'Received 4.9★ rating on "JavaScript Basics"', time: '1 day ago', color: 'yellow' },
            { icon: DollarSign, text: 'Earned ₹2,500 from course sales', time: '2 days ago', color: 'purple' }
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <div className={`p-2 ${activity.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : activity.color === 'green' ? 'bg-green-500/20 text-green-400' : activity.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-500/20 text-purple-400'} rounded-lg`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{activity.text}</p>
                <p className="text-slate-400 text-xs">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <h2 className="text-2xl font-bold text-white">Courses ({filteredCourses.length})</h2>
        <div className="flex flex-wrap items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none w-64" />
          </div>
          <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none">
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
          <p className="text-slate-400 mb-6">Create your first course to get started</p>
          <button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold">
            Create Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all group">
              <div className="relative h-48">
                <img src={course.img} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.level === 'Beginner' ? 'bg-green-500' : course.level === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                    {course.level}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex space-x-1">
                  <button onClick={() => editCourse(course)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteCourse(course.id, course.title)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-slate-300 text-sm mb-3 line-clamp-2">{course.desc}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-400 font-bold">₹{course.price?.toLocaleString()}</span>
                  <span className="text-slate-400 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {course.enrolled}
                  </span>
                  <span className="text-yellow-400 flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    {course.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => {
    const monthlyData = [
      { month: 'Jan', revenue: Math.floor(stats.totalRevenue * 0.15), students: Math.floor(stats.totalStudents * 0.12) },
      { month: 'Feb', revenue: Math.floor(stats.totalRevenue * 0.18), students: Math.floor(stats.totalStudents * 0.15) },
      { month: 'Mar', revenue: Math.floor(stats.totalRevenue * 0.22), students: Math.floor(stats.totalStudents * 0.18) },
      { month: 'Apr', revenue: Math.floor(stats.totalRevenue * 0.25), students: Math.floor(stats.totalStudents * 0.22) },
      { month: 'May', revenue: Math.floor(stats.totalRevenue * 0.30), students: Math.floor(stats.totalStudents * 0.28) },
      { month: 'Jun', revenue: Math.floor(stats.totalRevenue * 0.35), students: Math.floor(stats.totalStudents * 0.32) }
    ];

    const topCourses = localCourses
      .sort((a, b) => (b.enrolled || 0) - (a.enrolled || 0))
      .slice(0, 5)
      .map(course => ({
        ...course,
        revenue: (course.price || 0) * (course.enrolled || 0),
        completion: Math.floor(Math.random() * 30) + 70
      }));

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stats.totalStudents}</h3>
            <p className="text-blue-300 text-sm">Total Students</p>
            <div className="mt-3 h-1 bg-blue-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full animate-pulse" style={{width: '75%'}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-400" />
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">₹{Math.floor(stats.totalRevenue * 0.3).toLocaleString()}</h3>
            <p className="text-green-300 text-sm">Monthly Revenue</p>
            <div className="mt-3 h-1 bg-green-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-green-400 rounded-full animate-pulse" style={{width: '85%'}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-purple-400" />
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">4.8★</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stats.avgRating}</h3>
            <p className="text-purple-300 text-sm">Avg Rating</p>
            <div className="mt-3 h-1 bg-purple-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full animate-pulse" style={{width: '95%'}}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl p-6 border border-orange-500/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-orange-400" />
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">+5%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">78%</h3>
            <p className="text-orange-300 text-sm">Completion Rate</p>
            <div className="mt-3 h-1 bg-orange-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full animate-pulse" style={{width: '78%'}}></div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Revenue Trend</h3>
              <div className="flex space-x-2">
                <button className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">6M</button>
                <button className="text-xs bg-slate-700 text-slate-400 px-3 py-1 rounded-full">1Y</button>
              </div>
            </div>
            <div className="space-y-4">
              {monthlyData.map((data, idx) => (
                <div key={data.month} className="flex items-center space-x-4">
                  <span className="text-slate-400 text-sm w-8">{data.month}</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                      style={{width: `${(data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-green-400 text-sm font-semibold w-20">₹{data.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Student Growth */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Student Growth</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Growing</span>
              </div>
            </div>
            <div className="space-y-4">
              {monthlyData.map((data, idx) => (
                <div key={data.month} className="flex items-center space-x-4">
                  <span className="text-slate-400 text-sm w-8">{data.month}</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                      style={{width: `${(data.students / Math.max(...monthlyData.map(d => d.students))) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-blue-400 text-sm font-semibold w-16">{data.students}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Categories Distribution */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Course Categories</h3>
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div className="space-y-4">
              {[
                { category: 'Development', count: localCourses.filter(c => c.cat === 'development').length, color: 'blue' },
                { category: 'Design', count: localCourses.filter(c => c.cat === 'design').length, color: 'purple' },
                { category: 'Business', count: localCourses.filter(c => c.cat === 'business').length, color: 'green' },
                { category: 'AI & ML', count: localCourses.filter(c => c.cat === 'ai').length, color: 'orange' }
              ].map((cat, idx) => (
                <div key={cat.category} className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    cat.color === 'blue' ? 'bg-blue-500' :
                    cat.color === 'purple' ? 'bg-purple-500' :
                    cat.color === 'green' ? 'bg-green-500' :
                    'bg-orange-500'
                  }`}></div>
                  <span className="text-slate-300 text-sm flex-1">{cat.category}</span>
                  <span className={`font-semibold text-sm ${
                    cat.color === 'blue' ? 'text-blue-400' :
                    cat.color === 'purple' ? 'text-purple-400' :
                    cat.color === 'green' ? 'text-green-400' :
                    'text-orange-400'
                  }`}>{cat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Engagement Heatmap */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Student Engagement</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-xs">High Activity</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-center text-xs text-slate-400 py-2">{day}</div>
              ))}
              {Array.from({length: 28}, (_, i) => {
                const intensity = Math.random();
                return (
                  <div 
                    key={i} 
                    className={`h-8 rounded ${intensity > 0.7 ? 'bg-green-500' : intensity > 0.4 ? 'bg-green-600' : intensity > 0.2 ? 'bg-green-700' : 'bg-slate-700'} hover:scale-110 transition-transform cursor-pointer`}
                    title={`${Math.floor(intensity * 100)} activities`}
                  ></div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-slate-700 rounded"></div>
                <div className="w-3 h-3 bg-green-700 rounded"></div>
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <div className="w-3 h-3 bg-green-500 rounded"></div>
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Learning Progress Analytics */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Learning Progress</h3>
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-6">
              {[
                { level: 'Beginner', students: Math.floor(stats.totalStudents * 0.4), progress: 85, color: 'green' },
                { level: 'Intermediate', students: Math.floor(stats.totalStudents * 0.35), progress: 72, color: 'yellow' },
                { level: 'Advanced', students: Math.floor(stats.totalStudents * 0.25), progress: 68, color: 'red' }
              ].map(level => (
                <div key={level.level} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{level.level}</span>
                    <span className="text-slate-400 text-sm">{level.students} students</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          level.color === 'green' ? 'bg-green-500' :
                          level.color === 'yellow' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{width: `${level.progress}%`}}
                      ></div>
                    </div>
                    <span className={`text-sm font-semibold ${
                      level.color === 'green' ? 'text-green-400' :
                      level.color === 'yellow' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>{level.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Age Distribution */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">Age Distribution</h3>
            <div className="space-y-4">
              {[
                { range: '18-25', percentage: 35, count: Math.floor(stats.totalStudents * 0.35) },
                { range: '26-35', percentage: 40, count: Math.floor(stats.totalStudents * 0.40) },
                { range: '36-45', percentage: 20, count: Math.floor(stats.totalStudents * 0.20) },
                { range: '45+', percentage: 5, count: Math.floor(stats.totalStudents * 0.05) }
              ].map(age => (
                <div key={age.range} className="flex items-center space-x-4">
                  <span className="text-slate-300 text-sm w-12">{age.range}</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{width: `${age.percentage}%`}}
                    ></div>
                  </div>
                  <span className="text-blue-400 text-sm font-semibold w-8">{age.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">Top Locations</h3>
            <div className="space-y-4">
              {[
                { country: 'India', percentage: 45, flag: '🇮🇳' },
                { country: 'USA', percentage: 25, flag: '🇺🇸' },
                { country: 'UK', percentage: 15, flag: '🇬🇧' },
                { country: 'Canada', percentage: 10, flag: '🇨🇦' },
                { country: 'Others', percentage: 5, flag: '🌍' }
              ].map(location => (
                <div key={location.country} className="flex items-center space-x-3">
                  <span className="text-2xl">{location.flag}</span>
                  <span className="text-slate-300 text-sm flex-1">{location.country}</span>
                  <span className="text-green-400 text-sm font-semibold">{location.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Usage */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">Device Usage</h3>
            <div className="space-y-4">
              {[
                { device: 'Desktop', percentage: 60, icon: '💻' },
                { device: 'Mobile', percentage: 30, icon: '📱' },
                { device: 'Tablet', percentage: 10, icon: '📱' }
              ].map(device => (
                <div key={device.device} className="flex items-center space-x-3">
                  <span className="text-xl">{device.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300 text-sm">{device.device}</span>
                      <span className="text-purple-400 text-sm font-semibold">{device.percentage}%</span>
                    </div>
                    <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{width: `${device.percentage}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Courses */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Top Performing Courses</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-400 text-sm font-medium pb-3">Course</th>
                  <th className="text-left text-slate-400 text-sm font-medium pb-3">Students</th>
                  <th className="text-left text-slate-400 text-sm font-medium pb-3">Revenue</th>
                  <th className="text-left text-slate-400 text-sm font-medium pb-3">Rating</th>
                  <th className="text-left text-slate-400 text-sm font-medium pb-3">Completion</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {topCourses.map((course, idx) => (
                  <tr key={course.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-8 rounded-full ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-slate-600'}`}></div>
                        <div>
                          <p className="text-white font-medium text-sm line-clamp-1">{course.title}</p>
                          <p className="text-slate-400 text-xs">{course.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-white font-semibold">{course.enrolled || 0}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-green-400 font-semibold">₹{course.revenue.toLocaleString()}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">{course.rating}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                            style={{width: `${course.completion}%`}}
                          ></div>
                        </div>
                        <span className="text-slate-300 text-sm">{course.completion}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-white font-semibold">This Week</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">New Enrollments</span>
                <span className="text-green-400 font-semibold">+23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Course Views</span>
                <span className="text-blue-400 font-semibold">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Completion Rate</span>
                <span className="text-purple-400 font-semibold">82%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="text-white font-semibold">Growth Metrics</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Student Growth</span>
                <span className="text-green-400 font-semibold">+12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Revenue Growth</span>
                <span className="text-green-400 font-semibold">+8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Course Popularity</span>
                <span className="text-blue-400 font-semibold">+15%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-white font-semibold">Achievements</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-slate-300 text-sm">Top Rated Instructor</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-300 text-sm">1000+ Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300 text-sm">Course Creator</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Users className="w-5 h-5 text-orange-400" />
              </div>
              <h4 className="text-white font-semibold">Student Activity</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Online Now</span>
                <span className="text-green-400 font-semibold flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  47
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Active Today</span>
                <span className="text-blue-400 font-semibold">234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Avg Session</span>
                <span className="text-purple-400 font-semibold">24m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30">
          <MessageSquare className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">47</h3>
          <p className="text-blue-300 text-sm">Unread Messages</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-500/30">
          <Users className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">156</h3>
          <p className="text-green-300 text-sm">Active Conversations</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
          <Clock className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">2.4h</h3>
          <p className="text-purple-300 text-sm">Avg Response Time</p>
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-6">Recent Messages</h3>
        <div className="space-y-4">
          {Array.from({length: 8}, (_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {String.fromCharCode(65 + i)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white font-medium">Student {i + 1}</p>
                  <span className="text-xs text-slate-400">2h ago</span>
                </div>
                <p className="text-slate-300 text-sm">Question about assignment {i + 1}...</p>
              </div>
              {i < 3 && <div className="w-2 h-2 bg-blue-400 rounded-full"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEarnings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-500/30">
          <DollarSign className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">₹{stats.totalRevenue.toLocaleString()}</h3>
          <p className="text-green-300 text-sm">Total Earnings</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30">
          <TrendingUp className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">₹{Math.floor(stats.totalRevenue * 0.3).toLocaleString()}</h3>
          <p className="text-blue-300 text-sm">This Month</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
          <Calendar className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">₹{Math.floor(stats.totalRevenue * 0.12).toLocaleString()}</h3>
          <p className="text-purple-300 text-sm">This Week</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl p-6 border border-orange-500/30">
          <Target className="w-8 h-8 text-orange-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">₹{Math.floor(stats.totalRevenue * 0.05).toLocaleString()}</h3>
          <p className="text-orange-300 text-sm">Today</p>
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-6">Payout History</h3>
        <div className="space-y-4">
          {Array.from({length: 6}, (_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <DollarSign className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Monthly Payout</p>
                  <p className="text-slate-400 text-sm">{new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>
              <span className="text-green-400 font-semibold">₹{Math.floor(Math.random() * 50000 + 20000).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl p-6 border border-yellow-500/30">
          <Star className="w-8 h-8 text-yellow-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">{stats.avgRating}</h3>
          <p className="text-yellow-300 text-sm">Average Rating</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-500/30">
          <ThumbsUp className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">847</h3>
          <p className="text-green-300 text-sm">Total Reviews</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30">
          <MessageSquare className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">23</h3>
          <p className="text-blue-300 text-sm">New Reviews</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
          <TrendingUp className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">94%</h3>
          <p className="text-purple-300 text-sm">Positive Reviews</p>
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-6">Recent Reviews</h3>
        <div className="space-y-4">
          {Array.from({length: 6}, (_, i) => (
            <div key={i} className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div>
                    <p className="text-white font-medium">Student {i + 1}</p>
                    <div className="flex items-center space-x-1">
                      {Array.from({length: 5}, (_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < 4 + Math.floor(Math.random() * 2) ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-slate-400 text-sm">{Math.floor(Math.random() * 7) + 1} days ago</span>
              </div>
              <p className="text-slate-300 text-sm">Great course! Really helped me understand the concepts better. The instructor explains everything clearly.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30">
          <FileText className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">24</h3>
          <p className="text-blue-300 text-sm">Course Materials</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-500/30">
          <Video className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">156</h3>
          <p className="text-green-300 text-sm">Video Lessons</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
          <Download className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-1">2.4GB</h3>
          <p className="text-purple-300 text-sm">Total Storage</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6">Upload New Resource</h3>
          <div className="space-y-4">
            <input type="text" placeholder="Resource Title" className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
            <select className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none">
              <option>Select Type</option>
              <option>PDF Document</option>
              <option>Video</option>
              <option>Audio</option>
              <option>Presentation</option>
            </select>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-400">Drop files here or click to upload</p>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
              Upload Resource
            </button>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6">Recent Uploads</h3>
          <div className="space-y-3">
            {[
              { name: 'React Hooks Guide.pdf', type: 'PDF', size: '2.4 MB', date: '2 hours ago' },
              { name: 'Advanced Patterns.mp4', type: 'Video', size: '156 MB', date: '1 day ago' },
              { name: 'Code Examples.zip', type: 'Archive', size: '8.2 MB', date: '3 days ago' },
              { name: 'Presentation.pptx', type: 'Slides', size: '12.1 MB', date: '1 week ago' }
            ].map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white text-sm font-medium">{file.name}</p>
                    <p className="text-slate-400 text-xs">{file.type} • {file.size}</p>
                  </div>
                </div>
                <span className="text-slate-400 text-xs">{file.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-6">Profile Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">Instructor Name</h4>
                <p className="text-slate-400">Premium Instructor</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 font-semibold">{stats.avgRating}</span>
                </div>
              </div>
            </div>
            <input type="text" placeholder="Full Name" defaultValue="Instructor Name" className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
            <input type="email" placeholder="Email" defaultValue="instructor@example.com" className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
            <input type="text" placeholder="Specialization" defaultValue="Full Stack Development" className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
          </div>
          <div className="space-y-4">
            <textarea placeholder="Bio" defaultValue="Experienced developer with 10+ years in web development..." className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none h-32 resize-none" />
            <input type="text" placeholder="LinkedIn" className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
            <input type="text" placeholder="Website" className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6">Notification Settings</h3>
          <div className="space-y-4">
            {[
              { label: 'New student enrollments', enabled: true },
              { label: 'Course reviews', enabled: true },
              { label: 'Payment notifications', enabled: true },
              { label: 'Marketing emails', enabled: false },
              { label: 'Weekly reports', enabled: true }
            ].map((setting, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-white">{setting.label}</span>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${setting.enabled ? 'bg-blue-600' : 'bg-slate-600'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-6">Privacy Settings</h3>
          <div className="space-y-4">
            {[
              { label: 'Show profile to students', enabled: true },
              { label: 'Allow direct messages', enabled: true },
              { label: 'Public course statistics', enabled: false },
              { label: 'Show earnings publicly', enabled: false }
            ].map((setting, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-white">{setting.label}</span>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${setting.enabled ? 'bg-green-600' : 'bg-slate-600'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => {
    const studentData = Array.from({length: 12}, (_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      email: `student${i + 1}@example.com`,
      enrolledCourses: Math.floor(Math.random() * 5) + 1,
      progress: Math.floor(Math.random() * 100),
      lastActive: Math.floor(Math.random() * 7) + 1,
      status: Math.random() > 0.3 ? 'Active' : 'Inactive',
      rating: (Math.random() * 2 + 3).toFixed(1),
      completedCourses: Math.floor(Math.random() * 3)
    }));

    return (
      <div className="space-y-6">
        {/* Student Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">+5</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stats.totalStudents}</h3>
            <p className="text-blue-300 text-sm">Total Students</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-green-400" />
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">85%</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{Math.floor(stats.totalStudents * 0.85)}</h3>
            <p className="text-green-300 text-sm">Active Students</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-purple-400" />
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">+12</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{Math.floor(stats.totalStudents * 0.45)}</h3>
            <p className="text-purple-300 text-sm">Completed Courses</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between mb-4">
              <Star className="w-8 h-8 text-orange-400" />
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">4.8</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">4.6</h3>
            <p className="text-orange-300 text-sm">Avg Student Rating</p>
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Student Directory</h3>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input type="text" placeholder="Search students..." className="bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none w-64" />
              </div>
              <select className="bg-slate-800 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none">
                <option>All Students</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-slate-400 text-sm font-medium pb-3">Student</th>
                  <th className="text-left text-slate-400 text-sm font-medium pb-3">Courses</th>
                  <th className="text-left text-slate-400 text-sm font-medium pb-3">Progress</th>
                  <th className="text-left text-slate-400 text-sm font-medium pb-3">Last Active</th>
                  <th className="text-left text-slate-400 text-sm font-medium pb-3">Status</th>
                  <th className="text-left text-slate-400 text-sm font-medium pb-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {studentData.map(student => (
                  <tr key={student.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {student.name.charAt(8)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{student.name}</p>
                          <p className="text-slate-400 text-sm">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="text-white">{student.enrolledCourses}</span>
                        <span className="text-slate-400 text-sm">({student.completedCourses} completed)</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                            style={{width: `${student.progress}%`}}
                          ></div>
                        </div>
                        <span className="text-slate-300 text-sm">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-slate-300 text-sm">{student.lastActive} days ago</span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">{student.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'courses': return renderCourses();
      case 'analytics': return renderAnalytics();
      case 'students': return renderStudents();
      case 'messages': return renderMessages();
      case 'earnings': return renderEarnings();
      case 'reviews': return renderReviews();
      case 'resources': return renderResources();
      case 'profile': return renderProfile();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-white/10 p-6 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white gradient-text">
                EduHub
              </h1>
              <p className="text-slate-400 text-xs">Teaching Platform</p>
            </div>
          </div>
          
          {/* Instructor Profile */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">Instructor</h3>
                <p className="text-slate-400 text-xs">Premium Member</p>
                <div className="flex items-center space-x-1 mt-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 text-xs font-medium">{stats.avgRating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="space-y-1 flex-1">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${activeTab === item.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`} />
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
            </button>
          ))}
        </nav>
        
        {/* Bottom Section */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-white/10">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-semibold">Pro Instructor</span>
            </div>
            <p className="text-slate-300 text-xs mb-3">Unlock advanced features</p>
            <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-2 rounded-lg text-xs font-semibold transition-all transform hover:scale-105">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white capitalize flex items-center space-x-3">
              <span>{activeTab === 'overview' ? 'Dashboard' : activeTab}</span>
              {activeTab === 'overview' && <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>}
            </h2>
            <p className="text-slate-400 mt-1">
              {activeTab === 'overview' ? `Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}! Let's make today productive.` :
               activeTab === 'courses' ? `Manage your ${localCourses.length} courses and create new content` :
               activeTab === 'analytics' ? 'Track your teaching performance and student engagement' :
               activeTab === 'students' ? `Connect with your ${stats.totalStudents} enrolled students` :
               'Manage your teaching dashboard'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-4 bg-white/5 rounded-xl px-4 py-2 border border-white/10">
              <div className="text-center">
                <div className="text-sm font-semibold text-white">{stats.totalStudents}</div>
                <div className="text-xs text-slate-400">Students</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-sm font-semibold text-green-400">₹{Math.floor(stats.totalRevenue * 0.3).toLocaleString()}</div>
                <div className="text-xs text-slate-400">This Month</div>
              </div>
            </div>
            <div className="relative">
              <button className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-xl transition-colors relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>
            </div>
            {activeTab === 'courses' && (
              <button onClick={() => setShowAddModal(true)} data-add-course className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all transform hover:scale-105 shadow-lg btn-hover-lift">
                <Plus className="w-5 h-5" />
                <span>Create Course</span>
              </button>
            )}
            {activeTab === 'overview' && (
              <button onClick={() => setActiveTab('courses')} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all transform hover:scale-105 shadow-lg btn-hover-lift">
                <BookOpen className="w-5 h-5" />
                <span>View Courses</span>
              </button>
            )}
          </div>
        </div>

        {renderContent()}
      </div>

      {/* Modals */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
            <div className="p-6 border-b border-slate-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">{showEditModal ? 'Edit Course' : 'Create New Course'}</h2>
                <button onClick={() => (setShowAddModal(false), setShowEditModal(false))} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <form onSubmit={(e) => handleSubmit(e, showEditModal)} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Course Title" value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})} className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" required />
                <input type="number" placeholder="Price (₹)" value={courseForm.price} onChange={(e) => setCourseForm({...courseForm, price: e.target.value})} className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" required />
              </div>
              <textarea placeholder="Course Description" value={courseForm.desc} onChange={(e) => setCourseForm({...courseForm, desc: e.target.value})} className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none h-24 resize-none" required />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select value={courseForm.level} onChange={(e) => setCourseForm({...courseForm, level: e.target.value})} className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <select value={courseForm.cat} onChange={(e) => setCourseForm({...courseForm, cat: e.target.value})} className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none">
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="business">Business</option>
                  <option value="ai">AI & ML</option>
                  <option value="marketing">Marketing</option>
                  <option value="finance">Finance</option>
                  <option value="photography">Photography</option>
                  <option value="music">Music</option>
                </select>
                <input type="text" placeholder="Duration (e.g., 8h 30m)" value={courseForm.time} onChange={(e) => setCourseForm({...courseForm, time: e.target.value})} className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" required />
              </div>
              <input type="url" placeholder="Thumbnail URL" value={courseForm.thumbnailUrl} onChange={(e) => setCourseForm({...courseForm, thumbnailUrl: e.target.value})} className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none" />
              <div className="flex space-x-3">
                <button type="button" onClick={() => (setShowAddModal(false), setShowEditModal(false))} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50">
                  {isLoading ? <LoadingSpinner size="small" /> : (showEditModal ? 'Update Course' : 'Create Course')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;