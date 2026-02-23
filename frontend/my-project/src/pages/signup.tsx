import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, ArrowRight, ChevronLeft, Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../service/api'
import { useAuthStore } from '../store/authStore'

function Signup() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const signupMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const response = await authApi.register(data)
      return response.data
    },
    onSuccess: (data) => {
      console.log('✅ [SIGNUP] Success:', data);
      if (data.success && data.data) {
        setAuth(data.data.user || data.data, data.data.accessToken)
        navigate('/training')
      }
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signupMutation.mutate(formData)
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

      <div className="relative z-10 w-full max-w-[500px]">
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-gradient-to-tr from-accent to-secondary rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-xl font-black italic text-white px-1">E8</span>
          </div>
          
          <h1 className="text-2xl font-black tracking-tight uppercase mb-1 text-text">
            Join E8
          </h1>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest opacity-40">Create your account</p>
        </div>

        <div className="glass-card p-8 rounded-[1.5rem] relative border-white/10 dark:border-white/5 mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-muted uppercase tracking-widest ml-1">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={14} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 bg-white/[0.03] dark:bg-black/20 border border-white/10 rounded-xl text-text placeholder:text-muted/40 placeholder:font-bold focus:outline-none focus:border-secondary transition-all text-xs"
                    placeholder="Your Name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-muted uppercase tracking-widest ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={14} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 bg-white/[0.03] dark:bg-black/20 border border-white/10 rounded-xl text-text placeholder:text-muted/40 placeholder:font-bold focus:outline-none focus:border-secondary transition-all text-xs"
                    placeholder="email@address.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[9px] font-bold text-muted uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={14} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-2.5 bg-white/[0.03] dark:bg-black/20 border border-white/10 rounded-xl text-text placeholder:text-muted/40 placeholder:font-bold focus:outline-none focus:border-accent transition-all text-xs"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 ml-1">
              <input
                type="checkbox"
                id="terms"
                className="mt-0.5 h-3.5 w-3.5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent/20 transition-all cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-[9px] font-bold text-muted uppercase tracking-widest cursor-pointer leading-tight hover:text-text transition-colors">
                I accept <a href="#" className="text-text underline decoration-accent/30 font-bold">Terms</a> and <a href="#" className="text-text underline decoration-accent/30 font-bold">Privacy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="btn-premium w-full py-3.5 flex items-center justify-center gap-2 font-black text-[10px] tracking-[0.2em] shadow-lg disabled:opacity-70"
            >
              {signupMutation.isPending ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>
                  SIGN UP
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            {signupMutation.isError && (
              <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest text-center mt-2">
                {(signupMutation.error as any)?.data?.message || 'Failed to create account'}
              </p>
            )}
          </form>

          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <p className="text-[9px] font-bold text-muted uppercase tracking-widest">
              Have an account?{' '}
              <Link to="/login" className="text-accent hover:text-white transition-colors underline underline-offset-4 decoration-1">
                Login
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

export default Signup
