import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import type { ReactNode } from 'react'

interface AuthRedirectProps {
  children: ReactNode
}

/**
 * Redirects authenticated users away from auth pages (login/signup)
 * to the dashboard
 */
function AuthRedirect({ children }: AuthRedirectProps) {
  const { isAuthenticated, isLoading } = useAuthStore()

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted text-sm font-bold uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    )
  }

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/training" replace />
  }

  // Otherwise, show the auth page (login/signup)
  return <>{children}</>
}

export default AuthRedirect
