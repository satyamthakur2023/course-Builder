const LIVE_API = 'http://b7_40130868.byethost7.com/api';
const IS_LIVE = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE = IS_LIVE ? '/api' : LIVE_API;
const SERVER_ONLINE = false; // Set to true once byethost7 domain is working

const DEMO_USERS = {
  'student@example.com':    { id: 1, name: 'Demo Student',    email: 'student@example.com',    role: 'student', trialStartedAt: null },
  'instructor@example.com': { id: 2, name: 'Demo Instructor', email: 'instructor@example.com', role: 'instructor', trialStartedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }, // 2 days into trial
};

// Local user storage helpers
const getLocalUsers = () => {
  try { return JSON.parse(localStorage.getItem('registeredUsers') || '[]'); } catch { return []; }
};
const saveLocalUsers = (users) => localStorage.setItem('registeredUsers', JSON.stringify(users));

class AuthService {
  async login(credentials) {
    const { email, password } = credentials;

    // 1. Demo accounts — instant, no server
    if (DEMO_USERS[email] && password === 'password') {
      const user = DEMO_USERS[email];
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    }

    // 2. Locally registered users
    const localUsers = getLocalUsers();
    const localUser = localUsers.find(u => u.email === email && u.password === password);
    if (localUser) {
      const user = { id: localUser.id, name: localUser.name, email: localUser.email, role: localUser.role };
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    }

    // 3. Try live PHP server
    if (!SERVER_ONLINE) return { success: false, error: 'Invalid email or password' };
    try {
      const response = await fetch(`${API_BASE}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...credentials }),
        credentials: 'include',
        signal: AbortSignal.timeout(5000)
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || 'Invalid credentials' };
    } catch {
      return { success: false, error: 'Invalid email or password' };
    }
  }

  async register(credentials) {
    const { name, email, password, role } = credentials;

    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required' };
    }

    // Check demo emails
    if (DEMO_USERS[email]) {
      return { success: false, error: 'This email is already in use' };
    }

    // Check locally registered users
    const localUsers = getLocalUsers();
    if (localUsers.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    // Try live PHP server first
    if (SERVER_ONLINE) try {
      const response = await fetch(`${API_BASE}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...credentials }),
        credentials: 'include',
        signal: AbortSignal.timeout(5000)
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
    } catch {}

    // Fallback — save locally
    const user = { id: Date.now(), name, email, role: role || 'student', trialStartedAt: role === 'instructor' ? new Date().toISOString() : null };
    localUsers.push({ ...user, password });
    saveLocalUsers(localUsers);
    localStorage.setItem('user', JSON.stringify(user));
    return { success: true, user };
  }

  async logout() {
    try {
      await fetch(`${API_BASE}/logout.php`, {
        method: 'POST',
        credentials: 'include',
        signal: AbortSignal.timeout(3000)
      });
    } catch {}
    localStorage.removeItem('user');
    return { success: true };
  }

  async checkSession() {
    try {
      const response = await fetch(`${API_BASE}/check-session.php`, {
        credentials: 'include',
        signal: AbortSignal.timeout(3000)
      });
      const data = await response.json();
      return data.authenticated;
    } catch {
      return !!this.getUser();
    }
  }

  getUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch { return null; }
  }

  isAuthenticated() { return !!this.getUser(); }
}

export default new AuthService();
