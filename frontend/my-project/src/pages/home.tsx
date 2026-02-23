import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Check, Star, Play, MapPin, Camera, Clock, Rocket, Eye, CreditCard, Shield, Bot, Zap, Target, MessageSquare, ChevronDown, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useAuthStore } from '../store/authStore'

const Home = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
    } else {
      document.documentElement.classList.remove('light')
    }
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  }

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-dark text-text font-inter selection:bg-secondary/30 transition-colors duration-700 selection:text-dark">
      <div className="noise-overlay" />
      <div className="mesh-gradient" />
      
      {/* Premium Navigation */}
      <nav className={cn(
        "fixed top-8 w-full z-50 transition-all duration-700 px-6 sm:px-12",
        scrolled ? "py-0" : "py-2"
      )}>
        <div className="max-w-5xl mx-auto flex justify-center">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "rounded-full px-16 py-3 flex justify-between items-center gap-20 transition-all duration-500 border border-white/5 w-full",
              scrolled ? "bg-dark/40 backdrop-blur-2xl border-white/10 shadow-premium" : "bg-transparent border-transparent"
            )}
          >
            <Link to="/" className="flex items-center gap-4 group">
              <motion.div 
                whileHover={{ rotate: 12, scale: 1.1 }}
                className="w-10 h-10 bg-linear-to-tr from-accent to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 transition-transform"
              >
                <span className="text-xl font-black italic text-white">E8</span>
              </motion.div>
              <span className="text-xl font-black tracking-tight font-space group-hover:tracking-widest transition-all duration-500">PRODUCTIONS</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-10">
              {['Services', 'Pricing', 'How it Works', 'FAQ'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-[10px] font-black uppercase tracking-[0.3em] text-muted hover:text-text transition-all hover:scale-105">
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-secondary"
              >
                {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              </motion.button>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <UserIcon size={14} className="text-accent" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-text truncate max-w-[100px]">{user?.email.split('@')[0]}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-text transition-colors px-4">Login</Link>
                  <Link to="/signup" className="btn-premium py-2 px-8 text-[9px]!">Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-20" />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 relative"
        >
          <div className="text-center mb-24">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 mb-10">
               <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-ping" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">The New Industry Standard</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-[12vw] md:text-[9vw] font-black tracking-tighter mb-8 leading-[0.8] font-space px-4">
              LAUNDROMATS<br />
              <span className="text-gradient opacity-90 drop-shadow-2xl italic">REIMAGINED.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-muted/80 leading-relaxed mb-10 italic">
              "We transform local coin-ops into digital monopolies through algorithmic precision and high-fidelity brand design."
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-8">
               <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                 <Link to="/signup" className="btn-premium px-12 py-5 text-base shadow-glow-accent">Start Dominating</Link>
               </motion.div>
               <button className="flex items-center gap-4 px-8 py-5 rounded-full bg-white/5 hover:bg-white/10 transition-all font-black uppercase tracking-[0.2em] text-[10px] border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent"><Play size={10} fill="currentColor" /></div>
                  Watch Workflow
               </button>
            </motion.div>
          </div>

          {/* Hero Visuals / Bento Teaser */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-8">
             <motion.div 
               whileHover={{ y: -10 }}
               className="md:col-span-8 rounded-[3rem] p-1.5 bg-gradient-to-b from-white/10 to-transparent relative overflow-hidden group shadow-2xl"
             >
                <div className="relative h-[500px] w-full overflow-hidden rounded-[2.8rem]">
                  <img src="/laundromat_hero_premium_v2_1769691806904.png" alt="Laundromat Hero" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/10 to-transparent" />
                  
                  <div className="absolute bottom-10 left-10 right-10 p-10 bg-dark/40 backdrop-blur-2xl rounded-3xl border border-white/10 max-w-sm">
                    <div className="flex items-center gap-1 text-secondary mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                    <p className="text-lg font-bold leading-tight mb-3 text-text">"Our volume doubled in 3 weeks. It's like having a growth engine on autopilot."</p>
                    <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">— MARCUS R., SPARKLE COIN</span>
                  </div>
                </div>
             </motion.div>
             <div className="md:col-span-4 space-y-8">
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="rounded-[3rem] p-10 flex flex-col justify-center items-center text-center bg-white/5 border border-white/5 shadow-premium group h-1/2"
                >
                   <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:shadow-glow-secondary transition-all">
                      <Target size={28} />
                   </div>
                   <h3 className="text-xl font-black mb-3 font-space text-text tracking-widest uppercase">PRECISION SEO</h3>
                   <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-loose">Algorithmic targeting for local supremacy.</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="rounded-[3rem] p-10 flex flex-col justify-center items-center text-center bg-white/5 border border-white/5 shadow-premium group h-1/2"
                >
                   <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:shadow-glow-accent transition-all">
                      <Zap size={28} />
                   </div>
                   <h3 className="text-xl font-black mb-3 font-space text-text tracking-widest uppercase">48H LAUNCH</h3>
                   <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-loose">We don't wait for results. We force them.</p>
                </motion.div>
             </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="services" className="py-32 px-6 bg-dark relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[160px] pointer-events-none" />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
             <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tight mb-4 font-space text-text uppercase">
                THE INVISIBLE<br />
                <span className="text-secondary opacity-80 italic">CATASTROPHE.</span>
             </motion.h2>
             <motion.p variants={itemVariants} className="text-[10px] font-black text-muted uppercase tracking-[0.6em] mb-4">93% of customers will never find you on page 2.</motion.p>
             <motion.div variants={itemVariants} className="w-20 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {[
               { title: "THE GHOST TOWN", problem: "No photos, wrong address, and zero reviews.", impact: "Customers go to the cleaner-looking coin-op 2 miles away.", result: "$2K-$5K/MO LOST", icon: <Eye className="text-secondary" /> },
               { title: "MISSING INFO", problem: "Hours aren't listed. Phone number is wrong.", impact: "Customers call, get no answer, and move on instantly.", result: "80% BOUNCE RATE", icon: <MapPin className="text-accent" /> },
               { title: "ZERO TRUST", problem: "Blurry photos. No brand personality.", impact: "First impressions are fatal in the laundry business.", result: "0% CONVERSION", icon: <Camera className="text-white" /> }
             ].map((item, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  whileHover={{ y: -20, scale: 1.02 }}
                  className="group relative p-12 rounded-[3.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 shadow-2xl"
                >
                  <div className="mb-10 w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    {item.icon}
                  </div>
                  
                  <h3 className="text-2xl font-black mb-6 text-text font-space uppercase tracking-tighter">{item.title}</h3>
                  <div className="space-y-8 mb-10">
                    <div>
                      <p className="text-[9px] font-black text-secondary mb-3 uppercase tracking-widest">The Mistake</p>
                      <p className="text-base font-bold text-muted/80 leading-relaxed font-inter italic">"{item.problem}"</p>
                    </div>
                    <div className="pt-4 h-[120px]">
                      <p className="text-[9px] font-black text-accent mb-3 uppercase tracking-widest">The Impact</p>
                      <p className="text-base font-bold text-text mb-8 leading-relaxed line-clamp-3">{item.impact}</p>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                     <span className="text-xs font-black text-muted uppercase tracking-widest">Lost Revenue:</span>
                     <span className="text-lg font-black text-accent">{item.result}</span>
                  </div>
                </motion.div>
             ))}
          </div>
        </motion.div>
      </section>


      {/* Pricing / Packages Bento */}
      <section id="pricing" className="py-20 px-6 relative bg-dark">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-7xl mx-auto relative"
        >
          <div className="text-center mb-16">
            <motion.h2 variants={itemVariants} className="text-6xl md:text-8xl font-black mb-6 leading-[0.9] font-space uppercase">INVEST IN<br /><span className="opacity-40 italic">DOMINANCE.</span></motion.h2>
            <motion.p variants={itemVariants} className="text-[10px] font-black text-muted uppercase tracking-[0.6em]">One-time payment. Long-term customer growth.</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
             {[
               { name: "Starter", price: "297", badge: "Core Setup", color: "from-secondary to-blue-500", shadow: "shadow-glow-secondary", features: ["Full GMB Optimization", "Localized SEO Audit", "10 High-Res Photos", "48h Rapid Delivery"] },
               { name: "Professional", price: "497", badge: "Dominance", color: "from-accent to-orange-500", shadow: "shadow-glow-accent", features: ["25 Premium Assets", "Kinetic Intro Video", "Competitor Keyword Hijack", "Review Generation Tool", "24h VIP Priority"] },
               { name: "Premium", price: "897", badge: "Monopoly", color: "from-purple-500 to-indigo-500", shadow: "shadow-purple-500/20", features: ["Unlimited Media Assets", "360° Virtual Tours", "3mo Narrative Strategy", "Direct Expert Access", "Exclusive Territory Lock"] }
             ].map((pkg, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  whileHover={{ y: -15 }}
                  className={cn(
                    "group relative p-12 rounded-[3.5rem] bg-white/[0.03] border border-white/5 flex flex-col justify-between transition-all duration-500",
                    i === 1 ? "bg-white/[0.05] border-white/10 scale-105 z-10" : ""
                  )}
                >
                  {i === 1 && (
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent to-secondary text-white text-[9px] font-black px-8 py-2 rounded-full uppercase tracking-[0.3em] shadow-xl">
                        Industry Choice
                     </div>
                  )}
                  <div>
                    <h3 className="text-xl font-black mb-10 uppercase font-space tracking-widest text-muted group-hover:text-text transition-colors">{pkg.name}</h3>
                    <div className="flex items-baseline gap-2 mb-12">
                       <span className="text-xl font-bold text-muted">$</span>
                       <span className="text-8xl font-black text-text tracking-tighter font-space">{pkg.price}</span>
                    </div>
                    <ul className="space-y-6 mb-16">
                       {pkg.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted/60 group-hover:text-text transition-all">
                             <div className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_10px_rgba(45,225,252,0.5)]" /> {f}
                          </li>
                       ))}
                    </ul>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/signup" className={cn(
                      "btn-premium w-full text-center py-6",
                      i === 1 ? "shadow-glow-accent" : "bg-white/5 shadow-none border border-white/10"
                    )}>
                       Lock In {pkg.name}
                    </Link>
                  </motion.div>
                </motion.div>
             ))}
          </div>

          {/* Add-on Options Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { name: "Additional Profile", price: "$149" },
               { name: "Monthly Content", price: "$97/mo" },
               { name: "Review Automation", price: "$197" },
               { name: "Drone Shoot", price: "$497" }
             ].map((addon, i) => (
               <motion.div 
                key={i} 
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
                className="bg-white/[0.03] p-8 rounded-[2rem] text-center border border-white/5 cursor-default transition-all"
               >
                  <p className="text-[9px] font-black text-muted uppercase tracking-[0.25em] mb-2">{addon.name}</p>
                  <p className="text-2xl font-black text-text font-space">{addon.price}</p>
               </motion.div>
             ))}
           </div>
        </motion.div>
      </section>

      {/* Social Proof (Infinite Carousel) */}
      <section className="py-20 bg-dark relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-4 font-space uppercase tracking-tighter text-text"
          >
            LOVED BY <span className="text-secondary italic">HUNDREDS</span> OF OWNERS.
          </motion.h2>
          <p className="text-[10px] font-black text-muted uppercase tracking-[0.6em]">Join the top 1% of competitive laundromats.</p>
        </div>

        <div className="flex overflow-hidden select-none gap-8 group">
          <motion.div 
            animate={{ x: [0, -1600] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="flex shrink-0 gap-8 min-w-full"
          >
            {[
              { name: "M. Rodriguez", biz: "Sparkle Miami", quote: "Foot traffic up 487%. The best ROI I've seen in 20 years of laundry.", result: "+487% VIEWS" },
              { name: "J. Chen", biz: "QuickWash Austin", quote: "Ranking #1 for 'near me' terms. We're beating the big franchises now.", result: "#1 LOCAL" },
              { name: "S. Williams", biz: "Clean Scene", quote: "The transformation is incredible. Professional photos, perfect descriptions.", result: "+92 REVIEWS" },
              { name: "D. Miller", biz: "Metro Wash", quote: "Finally, a marketing team that understands the laundry industry.", result: "TOP 1%" }
            ].map((t, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 w-[400px] shrink-0 transition-all hover:bg-white/[0.05] hover:border-white/10 group/card">
                <div className="flex gap-1 mb-8 text-secondary">
                   {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="text-lg font-bold text-text italic mb-10 leading-relaxed font-inter">"{t.quote}"</p>
                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                   <div>
                      <p className="text-sm font-black text-text uppercase tracking-widest">{t.name}</p>
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest">{t.biz}</p>
                   </div>
                   <div className="px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-[9px] font-black border border-secondary/10">{t.result}</div>
                </div>
              </div>
            ))}
            {/* Duplicated for infinite effect */}
            {[
              { name: "M. Rodriguez", biz: "Sparkle Miami", quote: "Foot traffic up 487%. The best ROI I've seen in 20 years of laundry.", result: "+487% VIEWS" },
              { name: "J. Chen", biz: "QuickWash Austin", quote: "Ranking #1 for 'near me' terms. We're beating the big franchises now.", result: "#1 LOCAL" },
              { name: "S. Williams", biz: "Clean Scene", quote: "The transformation is incredible. Professional photos, perfect descriptions.", result: "+92 REVIEWS" },
              { name: "D. Miller", biz: "Metro Wash", quote: "Finally, a marketing team that understands the laundry industry.", result: "TOP 1%" }
            ].map((t, i) => (
              <div key={`dup-${i}`} className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 w-[400px] shrink-0 transition-all hover:bg-white/[0.05] hover:border-white/10 group/card">
                <div className="flex gap-1 mb-8 text-secondary">
                   {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="text-lg font-bold text-text italic mb-10 leading-relaxed font-inter">"{t.quote}"</p>
                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                   <div>
                      <p className="text-sm font-black text-text uppercase tracking-widest">{t.name}</p>
                      <p className="text-[9px] font-black text-muted uppercase tracking-widest">{t.biz}</p>
                   </div>
                   <div className="px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-[9px] font-black border border-secondary/10">{t.result}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Showcase (Premium Grid) */}
      <section className="py-20 px-6 bg-dark">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
           <div className="text-center mb-20">
              <motion.h2 variants={itemVariants} className="text-5xl md:text-8xl font-black mb-8 font-space uppercase tracking-tighter">UNFAIR ADVANTAGES.</motion.h2>
              <motion.p variants={itemVariants} className="text-[10px] font-black text-muted uppercase tracking-[0.5em]">Why we dominate while others fail.</motion.p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: <Bot size={28} />, title: "AI EXTRACTION", copy: "We scrape your city's data silos. Zero manual effort required." },
                { icon: <Camera size={28} />, title: "BRAND MAGIC", copy: "High-conversion photography optimized for the local algorithm." },
                { icon: <Shield size={28} />, title: "ENCRYPTION", copy: "Bank-grade security for your business credentials." },
                { icon: <Target size={28} />, title: "LOCAL CORE", copy: "Proprietary SEO mapping built for neighborhood dominance." },
                { icon: <Clock size={28} />, title: "RAPID LAUNCH", copy: "Launch in 48 hours or you get 50% of your investment back." },
                { icon: <MessageSquare size={28} />, title: "VIP ACCESS", copy: "Direct line to our growth strategists via private portal." }
              ].map((f, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group"
                >
                   <div className="w-20 h-20 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary mb-10 group-hover:bg-secondary group-hover:text-dark transition-all duration-500 shadow-glow-secondary">
                      {f.icon}
                   </div>
                   <h3 className="text-xl font-black mb-4 font-space tracking-widest uppercase text-text">{f.title}</h3>
                   <p className="text-xs font-bold text-muted/60 leading-relaxed uppercase tracking-widest">{f.copy}</p>
                </motion.div>
              ))}
           </div>
        </motion.div>
      </section>

      {/* How It Works (Roadmap) */}
      <section id="how-it-works" className="py-32 px-6 bg-dark relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex flex-col md:flex-row justify-between items-end gap-10 mb-12"
          >
             <motion.h2 variants={itemVariants} className="text-6xl md:text-[9vw] font-black leading-[0.85] font-space uppercase">THE<br /><span className="text-gradient">ROADMAP.</span></motion.h2>
             <motion.p variants={itemVariants} className="max-w-md text-[10px] font-black text-muted mb-8 px-10 border-l border-white/10 uppercase tracking-[0.4em] leading-loose">Four steps to absolute neighborhood laundry dominance.</motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             {[
               { icon: <Bot size={24} />, title: "INTELLIGENCE", copy: "Paste your URL. Our AI extracts your conversion data instantly." },
               { icon: <Check size={24} />, title: "PRECISION", copy: "Every address, hour, and phone number perfected for SEO." },
               { icon: <CreditCard size={24} />, title: "SECURE", copy: "One-time checkout with bank-grade AES-256 encryption." },
               { icon: <Rocket size={24} />, title: "LAUNCH", copy: "Dominating local search results in under 48 hours." }
             ].map((step, i) => (
               <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="p-12 rounded-[3.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all group"
               >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-10 group-hover:scale-110 group-hover:bg-secondary group-hover:text-dark transition-all duration-500">
                     {step.icon}
                  </div>
                  <h3 className="text-lg font-black mb-4 uppercase tracking-widest font-space text-text">{step.title}</h3>
                  <p className="text-[10px] font-bold text-muted/60 leading-relaxed uppercase tracking-widest italic">"{step.copy}"</p>
                  <div className="mt-12 text-6xl font-black text-white/[0.02] group-hover:text-white/[0.05] transition-colors pointer-events-none">0{i+1}</div>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion (Premium Glass) */}
      <section id="faq" className="py-20 px-6 bg-dark border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
             <h2 className="text-5xl md:text-7xl font-black mb-4 font-space uppercase">HAVE QUESTIONS?</h2>
             <p className="text-[10px] font-black text-muted uppercase tracking-[0.6em]">Transparent answers for serious owners.</p>
          </div>
          
          <div className="space-y-6">
             {[
               { q: "HOW FAST IS RAPID DELIVERY?", a: "We guarantee 48-hour delivery from the moment you submit your business info. Often, we launch in under 24." },
               { q: "IS MY SECURITY GUARANTEED?", a: "We never ask for your password. You simply add us as a manager to your profile using our secure system." },
               { q: "CAN I CUSTOMIZE THE OUTPUT?", a: "Absolutely. You can review all assets before launch or have our AI auto-optimize for max ROI." }
             ].map((item, i) => (
               <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all cursor-pointer group"
                onClick={() => toggleFaq(i)}
               >
                  <h3 className="text-lg font-black flex justify-between items-center font-space uppercase tracking-widest text-text">
                    {item.q}
                    <motion.div animate={{ rotate: activeFaq === i ? 180 : 0 }}>
                      <ChevronDown size={14} className="text-secondary" />
                    </motion.div>
                  </h3>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-10 text-[10px] font-bold text-muted/60 leading-relaxed uppercase tracking-widest italic border-l-2 border-secondary pl-6">"{item.a}"</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="py-20 px-6 bg-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-20">
            <div className="md:col-span-5">
               <Link to="/" className="flex items-center gap-6 mb-12 group">
                 <motion.div 
                  whileHover={{ rotate: 12 }}
                  className="w-16 h-16 bg-gradient-to-tr from-accent to-secondary rounded-2xl flex items-center justify-center shadow-2xl transition-transform"
                 >
                   <span className="text-3xl font-black italic text-white text-dark">E8</span>
                 </motion.div>
                 <span className="text-3xl font-black tracking-tighter font-space text-text">PRODUCTIONS</span>
               </Link>
               <p className="text-xl font-medium text-muted/60 leading-relaxed max-w-sm mb-12 italic">
                 "We don't build profiles. We build monopolies."
               </p>
               <div className="flex gap-4">
                  {['Twitter', 'Instagram', 'LinkedIn'].map(social => (
                    <motion.a 
                      key={social} 
                      whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
                      href="#" className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-muted hover:text-text transition-all font-black text-[10px] uppercase tracking-tighter"
                    >
                      {social[0]}
                    </motion.a>
                  ))}
               </div>
            </div>
            
            <div className="md:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-12">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary mb-12 opacity-50">Platform</h4>
                  <ul className="space-y-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">
                     <li><a href="#" className="hover:text-text hover:tracking-widest transition-all">Services</a></li>
                     <li><a href="#" className="hover:text-text hover:tracking-widest transition-all">Pricing</a></li>
                     <li><a href="#" className="hover:text-text hover:tracking-widest transition-all">Workflow</a></li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-accent mb-12 opacity-50">Company</h4>
                  <ul className="space-y-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">
                     <li><a href="#" className="hover:text-text hover:tracking-widest transition-all">About</a></li>
                     <li><a href="#" className="hover:text-text hover:tracking-widest transition-all">Case Studies</a></li>
                     <li><a href="#" className="hover:text-text hover:tracking-widest transition-all">Strategy</a></li>
                  </ul>
               </div>
               <div className="col-span-2 lg:col-span-1">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted mb-12 opacity-50">Legal</h4>
                  <ul className="space-y-6 text-[10px] font-black text-muted uppercase tracking-[0.3em]">
                     <li><a href="#" className="hover:text-text hover:tracking-widest transition-all">Privacy</a></li>
                     <li><a href="#" className="hover:text-text hover:tracking-widest transition-all">Terms</a></li>
                  </ul>
               </div>
            </div>
          </div>
          
          <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
             <div className="text-[9px] font-black text-muted/40 uppercase tracking-[0.8em]">
                © 2026 E8 PRODUCTIONS. THE NEW STANDARD.
             </div>
             <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.5em] text-muted/60">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse shadow-[0_0_10px_rgba(45,225,252,1)]" />
                SYSTEMS OPERATIONAL
             </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


export default Home
