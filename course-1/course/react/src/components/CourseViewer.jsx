import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Lock, CheckCircle, Clock, Users, Star, X, BookOpen,
  ChevronDown, ChevronUp, Award, Download, Share2, Heart,
  Volume2, Maximize, SkipForward, SkipBack, Pause, MessageSquare,
  ThumbsUp, Globe, BarChart2, Zap, TrendingUp, FileText, Video
} from 'lucide-react';
import useCourseStore from '../store/courseStore';

const CourseViewer = ({ course, isEnrolled, onClose, onEnroll }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSection, setExpandedSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(course.videoUrl || null);
  const [currentLessonTitle, setCurrentLessonTitle] = useState(course.title);
  const iframeRef = useRef(null);
  const { toggleFavorite, favorites } = useCourseStore();

  useEffect(() => {
    setIsFavorite(favorites.includes(course.id));
  }, [favorites, course.id]);

  // Build curriculum: use course.sections if instructor added them, else build from freeContent/paidContent
  const curriculum = course.sections?.length
    ? course.sections
    : [
        {
          title: 'Getting Started',
          lessons: (course.freeContent || []).map((item, i) => ({
            id: `free-${i}`, title: item, duration: '8:00', free: true, type: 'video',
            videoUrl: i === 0 ? course.videoUrl : null, note: ''
          }))
        },
        {
          title: 'Core Concepts',
          lessons: (course.paidContent || []).slice(0, Math.ceil((course.paidContent || []).length / 2)).map((item, i) => ({
            id: `paid-${i}`, title: item, duration: '12:00', free: false, type: 'video',
            videoUrl: null, note: ''
          }))
        },
        {
          title: 'Advanced Topics',
          lessons: (course.paidContent || []).slice(Math.ceil((course.paidContent || []).length / 2)).map((item, i) => ({
            id: `adv-${i}`, title: item, duration: '15:00', free: false, type: 'video',
            videoUrl: null, note: ''
          }))
        }
      ].filter(s => s.lessons.length > 0);

  const handleLessonClick = (lesson, canAccess) => {
    if (!canAccess) return;
    setActiveLesson(lesson.id === activeLesson ? null : lesson.id);
    // Load this lesson's video if it has one, else keep current
    if (lesson.videoUrl) {
      setCurrentVideoUrl(lesson.videoUrl);
      setCurrentLessonTitle(lesson.title);
    }
  };

  const totalLessons = curriculum.reduce((sum, s) => sum + s.lessons.length, 0);
  const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  const reviews = [
    { name: 'Alex M.', rating: 5, comment: 'Absolutely brilliant course! Transformed my career.', date: '2 days ago', avatar: 'A' },
    { name: 'Priya S.', rating: 5, comment: 'Best investment I made. Crystal clear explanations.', date: '1 week ago', avatar: 'P' },
    { name: 'James K.', rating: 4, comment: 'Very practical and well-structured. Highly recommend.', date: '2 weeks ago', avatar: 'J' },
  ];

  const toggleLesson = (lessonId) => {
    setCompletedLessons(prev =>
      prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
    );
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'curriculum', label: 'Curriculum', icon: Play },
    { id: 'instructor', label: 'Instructor', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn">
      <div className="bg-gray-900 rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col animate-scaleIn">

        {/* Video Player */}
        <div className="relative bg-black flex-shrink-0" style={{ aspectRatio: '16/7', maxHeight: '42vh' }}>
          {currentVideoUrl ? (
            <iframe
              ref={iframeRef}
              key={currentVideoUrl}
              src={`${currentVideoUrl}?autoplay=0&rel=0&modestbranding=1`}
              title={currentLessonTitle}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
              <div className="text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-all hover:scale-110"
                  onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </div>
                <p className="text-white/70 text-sm">Preview not available</p>
              </div>
            </div>
          )}

          {/* Overlay controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 pointer-events-auto">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>{course.level}</span>
            </div>
            <div className="flex space-x-2 pointer-events-auto">
              <button
                onClick={() => { toggleFavorite(course.id); setIsFavorite(!isFavorite); }}
                className={`p-2 rounded-full backdrop-blur-md transition-all hover:scale-110 ${isFavorite ? 'bg-red-500 text-white' : 'bg-black/60 text-white hover:bg-black/80'}`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all hover:scale-110"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-red-500 transition-all hover:scale-110"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom info bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <h1 className="text-white font-bold text-lg leading-tight line-clamp-1">{currentLessonTitle}</h1>
            <div className="flex items-center space-x-4 mt-1 text-white/70 text-xs">
              <span className="flex items-center"><Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />{course.rating}</span>
              <span className="flex items-center"><Users className="w-3 h-3 mr-1" />{course.enrolled?.toLocaleString()} students</span>
              <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{course.time}</span>
              <span className="flex items-center"><Globe className="w-3 h-3 mr-1" />English</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Tabs + Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-700/50 bg-gray-900 flex-shrink-0 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-5 animate-fadeIn">
                  <p className="text-gray-300 leading-relaxed">{course.desc}</p>

                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { icon: Star, label: 'Rating', value: course.rating, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                      { icon: Users, label: 'Students', value: (course.enrolled || 0).toLocaleString(), color: 'text-green-400', bg: 'bg-green-500/10' },
                      { icon: Clock, label: 'Duration', value: course.time, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                      { icon: BarChart2, label: 'Level', value: course.level, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    ].map((stat, i) => (
                      <div key={i} className={`${stat.bg} rounded-2xl p-3 text-center border border-white/5`}>
                        <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                        <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* What you'll learn */}
                  <div className="bg-gray-800/50 rounded-2xl p-4 border border-white/5">
                    <h3 className="text-white font-bold mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      What You'll Learn
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[...(course.freeContent || []), ...(course.paidContent || [])].map((item, i) => (
                        <div key={i} className="flex items-start space-x-2 text-gray-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="bg-gray-800/50 rounded-2xl p-4 border border-white/5">
                    <h3 className="text-white font-bold mb-3 flex items-center">
                      <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                      Requirements
                    </h3>
                    <ul className="space-y-1.5 text-gray-300 text-sm">
                      {['Basic computer skills', 'Stable internet connection', 'Willingness to learn & practice', 'No prior experience required'].map((req, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* CURRICULUM TAB */}
              {activeTab === 'curriculum' && (
                <div className="space-y-3 animate-fadeIn">
                  {/* Progress bar (enrolled only) */}
                  {isEnrolled && (
                    <div className="bg-gray-800/50 rounded-2xl p-4 border border-white/5">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300 font-medium">Your Progress</span>
                        <span className="text-blue-400 font-bold">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{completedLessons.length} of {totalLessons} lessons completed</p>
                    </div>
                  )}

                  {curriculum.map((section, si) => (
                    <div key={si} className="bg-gray-800/50 rounded-2xl border border-white/5 overflow-hidden">
                      <button
                        onClick={() => setExpandedSection(expandedSection === si ? -1 : si)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                            {si + 1}
                          </div>
                          <div className="text-left">
                            <p className="text-white font-semibold text-sm">{section.title}</p>
                            <p className="text-gray-500 text-xs">{section.lessons.length} lessons</p>
                          </div>
                        </div>
                        {expandedSection === si
                          ? <ChevronUp className="w-4 h-4 text-gray-400" />
                          : <ChevronDown className="w-4 h-4 text-gray-400" />
                        }
                      </button>

                      {expandedSection === si && (
                        <div className="border-t border-gray-700/50">
                          {section.lessons.map((lesson, li) => {
                            const canAccess = lesson.free || isEnrolled;
                            const isDone = completedLessons.includes(lesson.id);
                            const isActive = activeLesson === lesson.id;
                            return (
                              <div key={lesson.id} className="border-b border-gray-700/30 last:border-0">
                                <div
                                  onClick={() => handleLessonClick(lesson, canAccess)}
                                  className={`flex items-center justify-between px-4 py-3 transition-all ${
                                    canAccess ? 'cursor-pointer hover:bg-gray-700/30' : 'opacity-50 cursor-not-allowed'
                                  } ${isActive ? 'bg-blue-500/10' : ''}`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); canAccess && toggleLesson(lesson.id); }}
                                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                        isDone ? 'bg-green-500 border-green-500' : 'border-gray-600 hover:border-blue-400'
                                      }`}
                                    >
                                      {isDone && <CheckCircle className="w-4 h-4 text-white" />}
                                    </button>
                                    <div>
                                      <p className={`text-sm font-medium ${isActive ? 'text-blue-400' : 'text-gray-300'}`}>
                                        {lesson.title}
                                      </p>
                                      <div className="flex items-center space-x-2 mt-0.5">
                                        {lesson.free && <span className="text-xs text-green-400 font-medium">Free Preview</span>}
                                        {lesson.videoUrl && <span className="flex items-center text-xs text-blue-400"><Video className="w-3 h-3 mr-1" />Video</span>}
                                        {lesson.note && <span className="flex items-center text-xs text-yellow-400"><FileText className="w-3 h-3 mr-1" />Notes</span>}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">{lesson.duration}</span>
                                    {canAccess
                                      ? <Play className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                                      : <Lock className="w-3.5 h-3.5 text-gray-500" />
                                    }
                                  </div>
                                </div>
                                {/* Inline note viewer */}
                                {isActive && lesson.note && canAccess && (
                                  <div className="mx-4 mb-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                    <p className="text-xs text-yellow-300 font-semibold mb-1 flex items-center"><FileText className="w-3 h-3 mr-1" />Lesson Notes</p>
                                    <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">{lesson.note}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* INSTRUCTOR TAB */}
              {activeTab === 'instructor' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-gray-800/50 rounded-2xl p-5 border border-white/5">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-2xl">{course.instructor?.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{course.instructor}</h3>
                        <p className="text-blue-400 text-sm">Senior Instructor & Industry Expert</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                          <span className="text-gray-400 text-xs ml-1">4.9 instructor rating</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Students', value: '15K+', icon: Users, color: 'text-green-400' },
                        { label: 'Courses', value: '12', icon: BookOpen, color: 'text-blue-400' },
                        { label: 'Reviews', value: '4.9★', icon: Star, color: 'text-yellow-400' },
                      ].map((s, i) => (
                        <div key={i} className="bg-gray-700/50 rounded-xl p-3 text-center">
                          <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                          <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
                          <div className="text-xs text-gray-500">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed">
                      An industry veteran with 10+ years of hands-on experience. Passionate about breaking down complex topics into digestible, practical lessons. Known for real-world projects and career-focused teaching.
                    </p>
                  </div>
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Rating summary */}
                  <div className="bg-gray-800/50 rounded-2xl p-4 border border-white/5 flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-white">{course.rating}</div>
                      <div className="flex justify-center mt-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-4 h-4 ${parseFloat(course.rating) >= s ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                        ))}
                      </div>
                      <p className="text-gray-500 text-xs mt-1">Course Rating</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5,4,3,2,1].map(star => (
                        <div key={star} className="flex items-center space-x-2">
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                              style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : 2}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-xs w-4">{star}★</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review cards */}
                  {reviews.map((review, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-2xl p-4 border border-white/5">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{review.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-white font-semibold text-sm">{review.name}</p>
                            <span className="text-gray-500 text-xs">{review.date}</span>
                          </div>
                          <div className="flex mt-0.5 mb-2">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                            ))}
                          </div>
                          <p className="text-gray-300 text-sm">{review.comment}</p>
                          <button className="flex items-center space-x-1 mt-2 text-gray-500 hover:text-blue-400 text-xs transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Enroll Panel */}
          <div className="w-64 flex-shrink-0 border-l border-gray-700/50 bg-gray-900/80 p-4 flex flex-col space-y-4 overflow-y-auto">
            {/* Price */}
            <div className="text-center">
              {course.price === 0 ? (
                <div className="text-3xl font-bold text-green-400">Free</div>
              ) : (
                <>
                  <div className="text-3xl font-bold text-white">₹{course.price?.toLocaleString()}</div>
                  <div className="text-gray-500 text-xs line-through">₹{Math.round(course.price * 2.5).toLocaleString()}</div>
                  <div className="text-green-400 text-xs font-semibold">60% OFF — Limited Time</div>
                </>
              )}
            </div>

            {/* CTA */}
            {isEnrolled ? (
              <div className="space-y-2">
                <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl font-bold text-center text-sm">
                  ✓ Enrolled
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Progress</div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="text-xs text-blue-400 mt-1">{progress}% complete</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onEnroll(course)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25 text-sm"
              >
                {course.price === 0 ? 'Enroll Free' : 'Enroll Now'}
              </button>
            )}

            {/* Course includes */}
            <div className="space-y-2">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">This course includes</p>
              {[
                { icon: Play, text: `${totalLessons} on-demand lessons` },
                { icon: Clock, text: course.time + ' of content' },
                { icon: Download, text: 'Downloadable resources' },
                { icon: Award, text: 'Certificate of completion' },
                { icon: Globe, text: 'Full lifetime access' },
                { icon: TrendingUp, text: 'Career guidance' },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 text-gray-300 text-xs">
                  <item.icon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {['Hands-on', 'Certificate', 'Beginner Friendly', 'Live Projects'].map(tag => (
                <span key={tag} className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-lg border border-gray-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;
