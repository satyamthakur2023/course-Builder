// API Service for real data connectivity
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Course API methods
  async getCourses() {
    return this.request('/courses');
  }

  async getCourse(id) {
    return this.request(`/courses/${id}`);
  }

  async createCourse(courseData) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id, courseData) {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // User enrollment methods
  async enrollInCourse(courseId, userId) {
    return this.request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId, userId }),
    });
  }

  async getUserEnrollments(userId) {
    return this.request(`/users/${userId}/enrollments`);
  }

  // Analytics methods
  async getCourseAnalytics(courseId) {
    return this.request(`/courses/${courseId}/analytics`);
  }

  async getInstructorStats(instructorId) {
    return this.request(`/instructors/${instructorId}/stats`);
  }
}

// Fallback service for when API is not available
class LocalStorageService {
  constructor() {
    this.storageKey = 'coursesData';
    this.initializeData();
  }

  initializeData() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      const defaultData = {
        courses: [
          {id:1,title:'Full Stack Web Development',desc:'Master HTML, CSS, JS, React, Node.js and build dynamic web apps.',level:'Intermediate',rating:'4.8',time:'8h 30m',cat:'development',instructor:'John Parker',img:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop',price:99,enrolled:1250,progress:65,createdAt:new Date().toISOString()},
          {id:2,title:'Machine Learning Basics',desc:'Understand algorithms, train models, and deploy ML apps with Python.',level:'Advanced',rating:'4.9',time:'10h',cat:'ai',instructor:'Dr. Aisha Khan',img:'https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=400&h=200&fit=crop',price:149,enrolled:890,progress:0,createdAt:new Date().toISOString()},
          {id:3,title:'UI/UX Design for Beginners',desc:'Learn Figma, typography, wireframing, and design psychology.',level:'Beginner',rating:'4.6',time:'6h 45m',cat:'design',instructor:'Elena Rose',img:'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop',price:79,enrolled:2100,progress:100,createdAt:new Date().toISOString()},
          {id:4,title:'Entrepreneurship Essentials',desc:'Learn how to start and scale your business with proven models.',level:'Intermediate',rating:'4.7',time:'5h 20m',cat:'business',instructor:'Michael Stone',img:'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=200&fit=crop',price:89,enrolled:567,progress:30,createdAt:new Date().toISOString()},
          {id:5,title:'Data Science with Python',desc:'Dive into data visualization, cleaning, and statistical analysis.',level:'Advanced',rating:'4.9',time:'12h 15m',cat:'ai',instructor:'Dr. Lin Wei',img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',price:159,enrolled:1890,progress:0,createdAt:new Date().toISOString()},
          {id:6,title:'Digital Marketing Strategy',desc:'Master SEO, SEM, and social media advertising for maximum reach.',level:'Beginner',rating:'4.5',time:'7h 0m',cat:'business',instructor:'Sarah Lee',img:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop',price:69,enrolled:3200,progress:85,createdAt:new Date().toISOString()}
        ],
        enrollments: [],
        users: []
      };
      localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem(this.storageKey));
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  async getCourses() {
    const data = this.getData();
    return { data: data.courses };
  }

  async createCourse(courseData) {
    const data = this.getData();
    const newCourse = {
      ...courseData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      enrolled: 0,
      rating: '5.0'
    };
    data.courses.push(newCourse);
    this.saveData(data);
    return { data: newCourse };
  }

  async updateCourse(id, courseData) {
    const data = this.getData();
    const courseIndex = data.courses.findIndex(course => course.id === id);
    if (courseIndex !== -1) {
      data.courses[courseIndex] = { ...data.courses[courseIndex], ...courseData };
      this.saveData(data);
      return { data: data.courses[courseIndex] };
    }
    throw new Error('Course not found');
  }

  async deleteCourse(id) {
    const data = this.getData();
    data.courses = data.courses.filter(course => course.id !== id);
    this.saveData(data);
    return { success: true };
  }
}

// Smart service that tries API first, falls back to localStorage
class DataService {
  constructor() {
    this.apiService = new ApiService();
    this.localService = new LocalStorageService();
    this.isOnline = navigator.onLine;
    this.setupOnlineListener();
  }

  setupOnlineListener() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Connection restored - switching to API');
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Connection lost - switching to local storage');
    });
  }

  async getCourses() {
    try {
      if (this.isOnline) {
        return await this.apiService.getCourses();
      }
    } catch (error) {
      console.warn('API unavailable, using local storage:', error.message);
    }
    return await this.localService.getCourses();
  }

  async createCourse(courseData) {
    try {
      if (this.isOnline) {
        return await this.apiService.createCourse(courseData);
      }
    } catch (error) {
      console.warn('API unavailable, using local storage:', error.message);
    }
    return await this.localService.createCourse(courseData);
  }

  async updateCourse(id, courseData) {
    try {
      if (this.isOnline) {
        return await this.apiService.updateCourse(id, courseData);
      }
    } catch (error) {
      console.warn('API unavailable, using local storage:', error.message);
    }
    return await this.localService.updateCourse(id, courseData);
  }

  async deleteCourse(id) {
    try {
      if (this.isOnline) {
        return await this.apiService.deleteCourse(id);
      }
    } catch (error) {
      console.warn('API unavailable, using local storage:', error.message);
    }
    return await this.localService.deleteCourse(id);
  }
}

export default new DataService();