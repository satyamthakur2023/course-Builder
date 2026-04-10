import React, { useState } from 'react';
import { BookOpen, Clock, Star, Award, Play, Calendar, TrendingUp } from 'lucide-react';
import CourseCard from './CourseCard.jsx';
import useCourseStore from '../store/courseStore.js';
import useAuthStore from '../store/authStore.js';

const StudentDashboard = () => {
  const { courses, enrolledCourses, getEnrolledCourses } = useCourseStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('enrolled');
  
  const enrolledCoursesData = getEnrolledCourses();
  const completedCourses = enrolledCoursesData.filter(course => course.progress === 100);
  const inProgressCourses = enrolledCoursesData.filter(course => course.progress > 0 && course.progress < 100);

  const stats = {
    enrolled: enrolledCourses.length,
    completed: completedCourses.length,
    inProgress: inProgressCourses.length,
    totalHours: enrolledCoursesData.reduce((sum, course) => {
      const hours = parseFloat(course.time.replace(/[^\d.]/g, '')) || 0;
      return sum + hours;
    }, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.enrolled}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Enrolled Courses</h3>
            <p className="text-sm text-gray-600">Total courses enrolled</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.completed}</span>
            </div>
            <h3 className="font-semibold text-gray-900">Completed</h3>
            <p className="text-sm text-gray-600">Courses finished</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.inProgress}</span>
            </div>
            <h3 className="font-semibold text-gray-900">In Progress</h3>
            <p className="text-sm text-gray-600">Currently learning</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stats.totalHours.toFixed(1)}h</span>
            </div>
            <h3 className="font-semibold text-gray-900">Learning Hours</h3>
            <p className="text-sm text-gray-600">Total time invested</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'enrolled', label: 'My Courses', count: stats.enrolled },
                { id: 'progress', label: 'In Progress', count: stats.inProgress },
                { id: 'completed', label: 'Completed', count: stats.completed }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'enrolled' && (
              <div>
                {enrolledCoursesData.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledCoursesData.map(course => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        viewMode="grid"
                        onEnroll={() => {}}
                        onPreview={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No enrolled courses</h3>
                    <p className="text-gray-600">Start learning by enrolling in courses from the catalog</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'progress' && (
              <div>
                {inProgressCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inProgressCourses.map(course => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        viewMode="grid"
                        onEnroll={() => {}}
                        onPreview={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses in progress</h3>
                    <p className="text-gray-600">Continue learning from your enrolled courses</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'completed' && (
              <div>
                {completedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedCourses.map(course => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        viewMode="grid"
                        onEnroll={() => {}}
                        onPreview={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed courses</h3>
                    <p className="text-gray-600">Complete your enrolled courses to see them here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;