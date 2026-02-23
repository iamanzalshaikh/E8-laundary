import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, lazy, Suspense } from 'react'
import { useAuthStore } from './store/authStore'
import ProtectedRoute from './components/ProtectedRoute'
import AuthRedirect from './components/AuthRedirect'
import './App.css'

// ========================================
// LAZY LOADED PAGES
// ========================================
const Home = lazy(() => import('./pages/home'))
const Login = lazy(() => import('./pages/login'))
const Signup = lazy(() => import('./pages/signup'))
const Training = lazy(() => import('./client/TrainingPage'))

// ========================================
// QUERY CLIENT
// ========================================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// ========================================
// LOADING SCREEN COMPONENT
// ========================================
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted text-sm font-bold uppercase tracking-widest">Loading...</p>
      </div>
    </div>
  )
}

// ========================================
// ROUTER CONFIGURATION
// ========================================
export const router = createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      ),
      children: [
        // ========================================
        // PUBLIC ROUTES
        // ========================================
        {
          path: '/',
          element: <Home />,
        },

        // ========================================
        // AUTH ROUTES (redirect if already logged in)
        // ========================================
        {
          path: '/login',
          element: (
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          ),
        },
        {
          path: '/signup',
          element: (
            <AuthRedirect>
              <Signup />
            </AuthRedirect>
          ),
        },

        // ========================================
        // PROTECTED ROUTES
        // ========================================
        {
          path: '/training',
          element: (
            <ProtectedRoute allowedRoles={['client', 'admin']}>
              <Training />
            </ProtectedRoute>
          ),
        },

        // ========================================
        // 404 NOT FOUND
        // ========================================
        {
          path: '*',
          element: (
            <div className="min-h-screen bg-dark flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-8xl font-black text-secondary mb-4">404</h1>
                <p className="text-muted text-lg mb-8">Page not found</p>
                <a href="/" className="btn-premium px-8 py-4">
                  Go Home
                </a>
              </div>
            </div>
          ),
        },
      ],
    },
  ],
  { basename: '/' }
)

// ========================================
// APP COMPONENT
// ========================================
function App() {
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    // Restore auth state from localStorage on app mount
    hydrate()
  }, [hydrate])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
