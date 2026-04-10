import { create } from 'zustand';

const useStore = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const useCourseStore = create((set, get) => ({
  courses: [], // Start with empty array, will be populated by App.jsx
  favorites: useStore('favorites', []),
  enrolledCourses: useStore('enrolledCourses', []),
  notifications: [
    { id: 1, message: 'Welcome to RiseGen! Start your learning journey today.', time: '2 min ago', unread: true, type: 'info' },
    { id: 2, message: 'New courses added in AI & Machine Learning category.', time: '1 hour ago', unread: true, type: 'success' }
  ],
  loading: false,
  error: null,

  setCourses: (courses) => {
    saveToStorage('courses', courses);
    set({ courses });
  },

  addCourse: (course) => set((state) => {
    const newCourses = [...state.courses, { ...course, createdAt: new Date().toISOString() }];
    saveToStorage('courses', newCourses);
    return { courses: newCourses };
  }),

  updateCourse: (courseId, updates) => set((state) => {
    const updatedCourses = state.courses.map(course => 
      course.id === courseId ? { ...course, ...updates, updatedAt: new Date().toISOString() } : course
    );
    saveToStorage('courses', updatedCourses);
    return { courses: updatedCourses };
  }),

  deleteCourse: (courseId) => set((state) => {
    const filteredCourses = state.courses.filter(course => course.id !== courseId);
    saveToStorage('courses', filteredCourses);
    return { courses: filteredCourses };
  }),

  toggleFavorite: (courseId) => set((state) => {
    const newFavorites = state.favorites.includes(courseId)
      ? state.favorites.filter(id => id !== courseId)
      : [...state.favorites, courseId];
    saveToStorage('favorites', newFavorites);
    return { favorites: newFavorites };
  }),

  enrollInCourse: (courseId) => {
    const state = get();
    if (!state.enrolledCourses.includes(courseId)) {
      const newEnrolled = [...state.enrolledCourses, courseId];
      saveToStorage('enrolledCourses', newEnrolled);
      set({ enrolledCourses: newEnrolled });
      return true;
    }
    return false;
  },

  markNotificationRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(notif => 
      notif.id === notificationId ? { ...notif, unread: false } : notif
    )
  })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  getStats: () => {
    const state = get();
    return {
      totalCourses: state.courses.length,
      totalStudents: state.courses.reduce((sum, course) => sum + (course.enrolled || 0), 0),
      totalRevenue: state.courses.reduce((sum, course) => sum + ((course.price || 0) * (course.enrolled || 0)), 0),
      avgRating: state.courses.length > 0 
        ? (state.courses.reduce((sum, course) => sum + parseFloat(course.rating || 0), 0) / state.courses.length).toFixed(1) 
        : '0.0',
      unreadNotifications: state.notifications.filter(n => n.unread).length,
      categories: [...new Set(state.courses.map(course => course.cat))].length
    };
  },

  getEnrolledCourses: () => {
    const state = get();
    return state.courses.filter(course => state.enrolledCourses.includes(course.id));
  }
}));

export default useCourseStore;