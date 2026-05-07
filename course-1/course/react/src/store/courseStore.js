import { create } from 'zustand';

const CACHE_KEY = 'rg_courses';
const CACHE_META_KEY = 'rg_courses_meta';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const TRIAL_DAYS = 30;

const readStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

const writeStorage = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

const loadCachedCourses = () => {
  const meta = readStorage(CACHE_META_KEY, null);
  const courses = readStorage(CACHE_KEY, []);
  if (!meta || !courses.length) return { courses: [], cacheValid: false };
  const expired = Date.now() - meta.savedAt > CACHE_TTL_MS;
  return { courses, cacheValid: !expired };
};

// Sort: instructor-created (has trialEndsAt) newest first, then default courses
const sortCourses = (courses) => {
  const instructor = courses.filter(c => c.trialEndsAt).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const defaults = courses.filter(c => !c.trialEndsAt);
  return [...instructor, ...defaults];
};

const { courses: cachedCourses, cacheValid } = loadCachedCourses();

const useCourseStore = create((set, get) => ({
  courses: cachedCourses,
  cacheValid,
  favorites: readStorage('rg_favorites', []),
  enrolledCourses: readStorage('rg_enrolled', []),
  notifications: readStorage('rg_notifications', [
    { id: 1, message: 'Welcome to RiseGen! Start your learning journey today.', time: '2 min ago', unread: true, type: 'info' },
    { id: 2, message: 'New courses added in AI & Machine Learning category.', time: '1 hour ago', unread: true, type: 'success' }
  ]),
  loading: false,
  error: null,

  setCourses: (courses) => {
    writeStorage(CACHE_KEY, courses);
    writeStorage(CACHE_META_KEY, { savedAt: Date.now(), count: courses.length });
    set({ courses, cacheValid: true });
  },

  addCourse: (course) => set((state) => {
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const newCourse = { ...course, createdAt: now.toISOString(), trialEndsAt };
    // New instructor courses always go to the top
    const newCourses = sortCourses([newCourse, ...state.courses]);
    writeStorage(CACHE_KEY, newCourses);
    writeStorage(CACHE_META_KEY, { savedAt: Date.now(), count: newCourses.length });
    return { courses: newCourses };
  }),

  updateCourse: (courseId, updates) => set((state) => {
    const updatedCourses = state.courses.map(course =>
      course.id === courseId ? { ...course, ...updates, updatedAt: new Date().toISOString() } : course
    );
    writeStorage(CACHE_KEY, updatedCourses);
    writeStorage(CACHE_META_KEY, { savedAt: Date.now(), count: updatedCourses.length });
    return { courses: updatedCourses };
  }),

  deleteCourse: (courseId) => set((state) => {
    const filteredCourses = state.courses.filter(course => course.id !== courseId);
    writeStorage(CACHE_KEY, filteredCourses);
    writeStorage(CACHE_META_KEY, { savedAt: Date.now(), count: filteredCourses.length });
    return { courses: filteredCourses };
  }),

  toggleFavorite: (courseId) => set((state) => {
    const newFavorites = state.favorites.includes(courseId)
      ? state.favorites.filter(id => id !== courseId)
      : [...state.favorites, courseId];
    writeStorage('rg_favorites', newFavorites);
    return { favorites: newFavorites };
  }),

  enrollInCourse: (courseId) => {
    const state = get();
    if (!state.enrolledCourses.includes(courseId)) {
      const newEnrolled = [...state.enrolledCourses, courseId];
      writeStorage('rg_enrolled', newEnrolled);
      set({ enrolledCourses: newEnrolled });
      return true;
    }
    return false;
  },

  markNotificationRead: (notificationId) => set((state) => {
    const updated = state.notifications.map(notif =>
      notif.id === notificationId ? { ...notif, unread: false } : notif
    );
    writeStorage('rg_notifications', updated);
    return { notifications: updated };
  }),

  // Returns days remaining in trial for a course, or null if not a trial course
  getCourseTrialDaysLeft: (course) => {
    if (!course.trialEndsAt) return null;
    const msLeft = new Date(course.trialEndsAt) - Date.now();
    return Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
  },

  // Hide expired trial courses from students (instructors still see them)
  getVisibleCourses: (isInstructor = false) => {
    const { courses } = get();
    if (isInstructor) return courses;
    return courses.filter(c => !c.trialEndsAt || new Date(c.trialEndsAt) > new Date());
  },

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