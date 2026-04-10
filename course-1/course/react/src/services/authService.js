class AuthService {
  constructor() {
    this.baseURL = '/api';
  }

  async login(credentials) {
    // Mock authentication for development
    const mockUsers = {
      'student@example.com': { id: 1, name: 'Student User', email: 'student@example.com', role: 'student' },
      'instructor@example.com': { id: 2, name: 'Instructor User', email: 'instructor@example.com', role: 'instructor' }
    };
    
    if (mockUsers[credentials.email] && credentials.password === 'password') {
      const user = mockUsers[credentials.email];
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    }

    try {
      const response = await fetch(`${this.baseURL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });
      
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    }
  }

  async logout() {
    try {
      await fetch(`${this.baseURL}/logout.php`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.log('Logout API failed');
    }
    localStorage.removeItem('user');
    return { success: true };
  }

  async checkSession() {
    try {
      const response = await fetch(`${this.baseURL}/check-session.php`, {
        credentials: 'include'
      });
      const data = await response.json();
      return data.authenticated;
    } catch (error) {
      return !!this.getUser();
    }
  }

  getUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated() {
    return !!this.getUser();
  }
}

export default new AuthService();