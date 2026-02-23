import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, profileApi } from '../service/api';

interface User {
  _id: string;
  email: string;
  name?: string;
  role: 'client' | 'admin';
  businessName?: string;
  phone?: string;
  isEmailVerified?: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setAuth: (user: User, token: string) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
      
      setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      logout: async () => {
        try {
          // Call backend logout endpoint
          await authApi.logout();
          console.log('[AUTH] ✅ Logout API called');
        } catch (error) {
          console.error('[AUTH] Logout API error:', error);
        } finally {
          // Clear state regardless of API response
          set({ user: null, accessToken: null, isAuthenticated: false });
          console.log('[AUTH] ✅ State cleared');
        }
      },
      
      hydrate: async () => {
        try {
          set({ isLoading: true });
          
          const currentState = get();
          const token = currentState.accessToken;
          
          if (token) {
            console.log('[AUTH] Found persisted token, fetching fresh data...');
            
            try {
              // Always fetch fresh user data from API if we have a token
              const response = await profileApi.getProfile();
              
              if (response.data?.success && response.data?.data) {
                const freshUser = response.data.data.user || response.data.data;
                console.log('✅ [AUTH] Fetched fresh user profile:', freshUser);
                set({ user: freshUser, isAuthenticated: true });
              } else {
                throw new Error('Invalid user data');
              }
            } catch (error: any) {
              console.warn('⚠️ [AUTH] Failed to fetch fresh profile:', error);
              
              // If 401 or if we don't even have a persisted user object to fall back on, clear auth state
              if (error.response?.status === 401 || !currentState.user) {
                console.log('[AUTH] Session invalid, clearing state');
                set({ user: null, accessToken: null, isAuthenticated: false });
              }
            }
          } else {
            console.log('[AUTH] No persisted token found');
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error('[AUTH] Hydration error:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
