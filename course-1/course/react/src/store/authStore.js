import { create } from 'zustand';

const AUTH_KEY = 'rg_user';
const SESSION_KEY = 'rg_session';
const SUB_KEY = 'rg_subscription';
const TRIAL_DAYS = 30;
const PLANS = {
  basic:   { label: 'Basic',       price: 499,  maxCourses: 5,  color: 'blue' },
  pro:     { label: 'Pro',         price: 999,  maxCourses: 20, color: 'purple' },
  premium: { label: 'Premium',     price: 1999, maxCourses: Infinity, color: 'yellow' },
};

const readUser = () => {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch { return null; }
};

const readSub = () => {
  try { return JSON.parse(localStorage.getItem(SUB_KEY) || 'null'); } catch { return null; }
};

const writeUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      localStorage.setItem(SESSION_KEY, JSON.stringify({ savedAt: Date.now() }));
    } else {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SUB_KEY);
    }
  } catch {}
};

const writeSub = (sub) => {
  try {
    if (sub) localStorage.setItem(SUB_KEY, JSON.stringify(sub));
    else localStorage.removeItem(SUB_KEY);
  } catch {}
};

const useAuthStore = create((set, get) => ({
  user: readUser(),
  isAuthenticated: !!readUser(),
  subscription: readSub(),
  loading: false,
  PLANS,

  // Returns days left in 30-day trial (based on account creation)
  getTrialDaysLeft: () => {
    const { user } = get();
    if (!user?.trialStartedAt) return TRIAL_DAYS; // new account, full trial
    const msLeft = new Date(user.trialStartedAt).getTime() + TRIAL_DAYS * 86400000 - Date.now();
    return Math.max(0, Math.ceil(msLeft / 86400000));
  },

  isTrialExpired: () => get().getTrialDaysLeft() === 0,

  isSubscribed: () => {
    const { subscription } = get();
    if (!subscription) return false;
    return new Date(subscription.expiresAt) > new Date();
  },

  // Simulate purchasing a plan (in production this would hit a payment gateway)
  subscribe: (planKey) => {
    const plan = PLANS[planKey];
    if (!plan) return false;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 365 * 86400000).toISOString(); // 1 year
    const sub = { plan: planKey, label: plan.label, startedAt: now.toISOString(), expiresAt, maxCourses: plan.maxCourses };
    writeSub(sub);
    set({ subscription: sub });
    return true;
  },

  login: async (credentials) => {
    set({ loading: true });
    try {
      const { default: authService } = await import('../services/authService');
      const result = await authService.login(credentials);
      if (result.success) {
        writeUser(result.user);
        set({ user: result.user, isAuthenticated: true, subscription: readSub() });
      }
      set({ loading: false });
      return result;
    } catch {
      set({ loading: false });
      return { success: false, error: 'Login failed' };
    }
  },

  register: async (credentials) => {
    set({ loading: true });
    try {
      const { default: authService } = await import('../services/authService');
      const result = await authService.register(credentials);
      if (result.success) {
        writeUser(result.user);
        set({ user: result.user, isAuthenticated: true });
      }
      set({ loading: false });
      return result;
    } catch {
      set({ loading: false });
      return { success: false, error: 'Registration failed' };
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const { default: authService } = await import('../services/authService');
      await authService.logout();
    } catch {}
    writeUser(null);
    set({ user: null, isAuthenticated: false, subscription: null, loading: false });
    return { success: true };
  },

  checkSession: async () => {
    try {
      const { default: authService } = await import('../services/authService');
      const isValid = await authService.checkSession();
      if (!isValid) {
        writeUser(null);
        set({ user: null, isAuthenticated: false, subscription: null });
      }
      return isValid;
    } catch {
      return !!get().user;
    }
  }
}));

export default useAuthStore;
