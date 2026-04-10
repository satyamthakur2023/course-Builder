import React, { useState } from 'react';
import { Play, Lock, CheckCircle, Clock, Users, Star, X } from 'lucide-react';

const CourseViewer = ({ course, isEnrolled, onClose, onEnroll }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedContent, setSelectedContent] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Star },
    { id: 'content', label: 'Course Content', icon: Play },
    { id: 'instructor', label: 'Instructor', icon: Users }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="glass-card rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-start space-x-6">
              <img 
                src={course.img} 
                alt={course.title}
                className="w-32 h-20 object-cover rounded-xl shadow-lg"
                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop'}
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                <p className="text-blue-100 mb-4">{course.desc}</p>
                <div className="flex items-center space-x-6 text-sm">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    {course.rating} ({course.enrolled?.toLocaleString()} students)
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.time}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">{course.level}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-2">₹{course.price?.toLocaleString()}</div>
                {!isEnrolled ? (
                  <button 
                    onClick={() => onEnroll(course)}
                    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                  >
                    Enroll Now
                  </button>
                ) : (
                  <div className="bg-green-500/20 text-green-300 px-6 py-3 rounded-xl font-bold">
                    ✓ Enrolled
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="bg-white/5 backdrop-blur-md border-b border-white/10">
            <div className="flex space-x-1 p-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'bg-white text-blue-600 shadow-lg' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-h-96 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Video Preview */}
              {course.hasVideo && (
                <div className="bg-black rounded-2xl overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold">Course Preview Video</p>
                      <p className="text-sm opacity-70">Get a glimpse of what you'll learn</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">What You'll Learn</h3>
                  <ul className="space-y-2">
                    {course.paidContent?.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Course Requirements</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Basic computer skills</li>
                    <li>• Internet connection</li>
                    <li>• Willingness to learn</li>
                    <li>• No prior experience needed</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Play className="w-5 h-5 mr-2 text-green-400" />
                  Free Preview Content
                </h3>
                <div className="space-y-2">
                  {course.freeContent?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Play className="w-4 h-4 text-green-400" />
                        <span className="text-white">{item}</span>
                      </div>
                      <button className="text-green-400 hover:text-green-300 font-medium">
                        Watch Free
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-orange-400" />
                  Premium Content
                </h3>
                <div className="space-y-2">
                  {course.paidContent?.map((item, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-xl ${
                      isEnrolled 
                        ? 'bg-blue-500/10 border border-blue-500/20' 
                        : 'bg-gray-500/10 border border-gray-500/20'
                    }`}>
                      <div className="flex items-center space-x-3">
                        {isEnrolled ? (
                          <Play className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={isEnrolled ? 'text-white' : 'text-gray-400'}>{item}</span>
                      </div>
                      {isEnrolled ? (
                        <button className="text-blue-400 hover:text-blue-300 font-medium">
                          Watch Now
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">Enroll to access</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'instructor' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{course.instructor?.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{course.instructor}</h3>
                  <p className="text-gray-300">Expert Instructor</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-blue-400">4.8</div>
                  <div className="text-sm text-gray-400">Instructor Rating</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-green-400">15K+</div>
                  <div className="text-sm text-gray-400">Students Taught</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <div className="text-2xl font-bold text-purple-400">25</div>
                  <div className="text-sm text-gray-400">Courses Created</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">About the Instructor</h4>
                <p className="text-gray-300 leading-relaxed">
                  An experienced professional with over 10 years in the industry. Passionate about teaching and helping students achieve their goals through practical, hands-on learning experiences.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;