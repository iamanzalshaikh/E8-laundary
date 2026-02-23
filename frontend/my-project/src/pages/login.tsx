import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, ArrowRight, ChevronLeft, Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../service/api'
import { useAuthStore } from '../store/authStore'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await authApi.login(data)
      return response.data
    },
    onSuccess: (data) => {
      console.log('✅ [LOGIN] Success:', data);
      if (data.success && data.data) {
        setAuth(data.data.user || data.data, data.data.accessToken)
        navigate('/training')
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <div className="h-screen w-screen bg-dark text-text font-inter selection:bg-secondary/30 overflow-hidden relative flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="noise-overlay" />
        <div className="mesh-gradient" />
        <div className="absolute inset-0 bg-grid opacity-10" />
      </div>

      <Link 
        to="/" 
        className="fixed top-6 left-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-text transition-all z-50 group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </Link>

      <div className="relative z-10 w-full max-w-[380px]">
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-gradient-to-tr from-accent to-secondary rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-xl font-black italic text-white px-1">E8</span>
          </div>
          
          <h1 className="text-2xl font-black tracking-tight uppercase mb-1 text-text">
            Login
          </h1>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-40">E8 Productions</p>
        </div>

        <div className="glass-card p-8 rounded-[1.5rem] relative border-white/10 dark:border-white/5 mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold text-muted uppercase tracking-widest ml-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={14} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.03] dark:bg-black/20 border border-white/10 rounded-xl text-text placeholder:text-muted/40 placeholder:font-bold focus:outline-none focus:border-secondary transition-all text-xs"
                  placeholder="name@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[9px] font-bold text-muted uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-[9px] font-bold text-accent uppercase tracking-widest hover:text-white transition-colors">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={14} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/[0.03] dark:bg-black/20 border border-white/10 rounded-xl text-text placeholder:text-muted/40 placeholder:font-bold focus:outline-none focus:border-accent transition-all text-xs"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1">
              <input
                type="checkbox"
                id="remember"
                className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 text-secondary focus:ring-secondary/20 transition-all cursor-pointer"
              />
              <label htmlFor="remember" className="text-[9px] font-bold text-muted uppercase tracking-widest cursor-pointer hover:text-text transition-colors">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="btn-premium w-full py-4 flex items-center justify-center gap-2 font-black text-[10px] tracking-[0.2em] shadow-lg disabled:opacity-70"
            >
              {loginMutation.isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  LOGIN
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            {loginMutation.isError && (
              <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest text-center mt-2">
                {(loginMutation.error as any)?.data?.message || 'Invalid credentials'}
              </p>
            )}
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[9px] font-bold text-muted uppercase tracking-widest">
              No account?{' '}
              <Link to="/signup" className="text-secondary hover:text-white transition-colors underline underline-offset-4 decoration-1">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
           <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted opacity-20">
              © 2026 E8 PRODUCTIONS
           </p>
        </div>
      </div>
    </div>
  )
}

export default Login
