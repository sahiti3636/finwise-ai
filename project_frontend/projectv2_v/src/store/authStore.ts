import { create } from 'zustand';
import { authAPI } from '../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  changePassword: (passwordData: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  loading: true,

  login: async (username: string, password: string) => {
    try {
      console.log('Login attempt for:', username);
      set({ loading: true });
      
      // Get tokens
      const tokenData = await authAPI.login(username, password);
      console.log('Login successful, got tokens');
      
      // Get user details
      const userData = await authAPI.getUserDetails();
      console.log('Got user details:', userData);
      
      set({
        isAuthenticated: true,
        user: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: 'user' // Default role, can be updated based on your needs
        },
        loading: false
      });
    } catch (error) {
      console.error('Login failed:', error);
      set({ loading: false });
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      console.log('Registration attempt for:', userData.username);
      set({ loading: true });
      await authAPI.register(userData);
      console.log('Registration successful');
      set({ loading: false });
    } catch (error) {
      console.error('Registration failed:', error);
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    console.log('Logging out');
    authAPI.logout();
    set({
      isAuthenticated: false,
      user: null,
      loading: false
    });
  },

  checkAuth: async () => {
    try {
      console.log('Checking authentication...');
      const token = localStorage.getItem('access_token');
      console.log('Token found:', !!token);
      
      if (!token) {
        console.log('No token found, setting as not authenticated');
        set({ isAuthenticated: false, user: null, loading: false });
        return;
      }

      // Verify token by getting user details
      console.log('Verifying token...');
      const userData = await authAPI.getUserDetails();
      console.log('Token verified, user data:', userData);
      
      set({
        isAuthenticated: true,
        user: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: 'user'
        },
        loading: false
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token is invalid, clear auth state
      authAPI.logout();
      set({
        isAuthenticated: false,
        user: null,
        loading: false
      });
    }
  },

  changePassword: async (passwordData: any) => {
    try {
      console.log('Changing password...');
      set({ loading: true });
      await authAPI.changePassword(passwordData);
      console.log('Password changed successfully');
      set({ loading: false });
    } catch (error) {
      console.error('Password change failed:', error);
      set({ loading: false });
      throw error;
    }
  }
}));