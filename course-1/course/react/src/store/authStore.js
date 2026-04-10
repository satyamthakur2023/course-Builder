import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })(),
  isAuthenticated: !!localStorage.getItem('user'),
  loading: false,
  
  login: async (credentials) => {
    set({ loading: true });
    try {
      const { default: authService } = await import('../services/authService');
      const result = await authService.login(credentials);
      if (result.success) {
        set({ user: result.user, isAuthenticated: true, loading: false });
      } else {
        set({ loading: false });
      }
      return result;
    } catch (error) {
      set({ loading: false });
      return { success: false, error: 'Login failed' };
    }
  },
  
  logout: async () => {
    set({ loading: true });
    try {
      const { default: authService } = await import('../services/authService');
      await authService.logout();
    } catch (error) {
      console.log('Logout error:', error);
    }
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false, loading: false });
    return { success: true };
  },

  checkSession: async () => {
    try {
      const { default: authService } = await import('../services/authService');
      const isValid = await authService.checkSession();
      if (!isValid) {
        set({ user: null, isAuthenticated: false });
      }
      return isValid;
    } catch (error) {
      return !!get().user;
    }
  }
}));

export default useAuthStore;