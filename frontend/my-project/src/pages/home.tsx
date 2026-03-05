import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ChevronDown, Check, Star, Info, Target, Zap, Shield, Bot, Rocket, Play, ExternalLink, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

const Home = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'FAQ', href: '#faq' }
  ]

  return (
    <div className="min-h-screen bg-white text-[#3c4043] font-roboto selection:bg-[#e8f0fe] selection:text-[#1a73e8] overflow-x-hidden">
      {/* Google-style Navigation - Enhanced */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white border-b border-[#dadce0] shadow-sm py-3" : "bg-white/80 backdrop-blur-md"
      )}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 bg-[#1a73e8] rounded-lg flex items-center justify-center text-white font-bold text-base italic transition-transform group-hover:rotate-12 group-hover:scale-110">E8</div>
              <span className="text-xl font-medium text-[#5f6368] hidden sm:inline-block">Productions</span>
            </Link>
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-[14px] font-medium text-[#5f6368] hover:text-[#1a73e8] transition-colors relative group">
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1a73e8] transition-all group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-[14px] font-medium text-[#1a73e8] px-5 py-2 hover:bg-[#f8f9fa] rounded-md transition-colors">Sign in</Link>
            <Link to="/signup" className="btn-premium px-6 py-2.5 text-[14px]">Get Started</Link>
            <button 
              className="lg:hidden p-2 text-[#5f6368]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-lg font-medium text-[#3c4043]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-[#dadce0] my-4" />
              <Link to="/login" className="text-lg font-medium text-[#1a73e8]">Sign in</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24 md:pt-32">
        {/* Hero Section - Elevated Spacing & Layout */}
        <section id="overview" className="max-w-7xl mx-auto px-6 mb-20 md:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1f3f4] text-[#1a73e8] text-[12px] font-bold uppercase tracking-wider mb-8">
                <span className="w-1.5 h-1.5 bg-[#1a73e8] rounded-full" />
                Laundromat Growth Engine
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-[#202124] leading-[1.05] mb-8 tracking-tighter">
                LAUNDROMATS<br />
                <span className="text-[#1a73e8] italic font-normal">REIMAGINED.</span>
              </h1>
              <p className="text-lg md:text-xl text-[#5f6368] leading-relaxed mb-12 max-w-xl">
                We transform local coin-ops into digital monopolies through algorithmic precision and high-fidelity brand design.
              </p>
              <div className="flex flex-wrap gap-5">
                <Link to="/signup" className="bg-[#1a73e8] text-white px-10 py-4 rounded-full font-bold hover:bg-[#1557b0] shadow-glow-blue transition-all">Start Now</Link>
                <button className="flex items-center gap-3 px-8 py-4 rounded-full border border-[#dadce0] font-bold hover:bg-[#f8f9fa] transition-all text-[#3c4043]">
                  <Play size={18} fill="currentColor" className="text-[#1a73e8]" /> Watch Workflow
                </button>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-[#dadce0]">
                <img 
                  src="/modern_laundromat_premium_1772568417464.png" 
                  alt="Modern Premium Laundromat" 
                  className="w-full object-cover transition-transform duration-[3s] hover:scale-105"
                />
              </div>
              {/* Floating Success Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-8 -right-4 md:-right-12 bg-white p-6 rounded-2xl shadow-premium border border-[#dadce0] z-20 max-w-[280px]"
              >
                <div className="flex items-center gap-1 text-[#fbbc04] mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-[14px] font-medium text-[#202124] italic mb-3">"Our volume doubled in 3 weeks. It's like having growth on autopilot."</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8] font-bold text-[10px]">MR</div>
                  <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-wider">MARCUS R., SPARKLE COIN</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Success Legend - Large Centerpiece */}
        <section className="bg-[#f8f9fa] py-24 md:py-32 px-6 border-y border-[#f1f3f4]">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-[13px] font-bold text-[#1a73e8] uppercase tracking-[0.2em] mb-12">What success looks like</p>
            <h2 className="text-4xl md:text-5xl font-light italic text-[#202124] leading-tight mb-16">
              “LOVED BY <span className="text-[#1a73e8] not-italic font-bold">HUNDREDS</span> OF OWNERS.”
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="relative group overflow-hidden rounded-3xl">
                <img 
                  src="/happy_laundromat_owner_1772568527689.png" 
                  alt="Happy Owner" 
                  className="w-full rounded-3xl shadow-xl transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#1a73e8]/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="text-left space-y-8">
                <p className="text-xl text-[#5f6368] leading-relaxed">
                  Join the top 1% of competitive laundromats and turn your local business into a neighborhood brand with our digital-first approach.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1a73e8] flex items-center justify-center text-white">
                      <Check size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#202124]">+487% VIEWS</h4>
                      <p className="text-sm text-[#5f6368]">In the first month of implementation.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#1a73e8] flex items-center justify-center text-white">
                      <Target size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#202124]">#1 LOCAL RANKING</h4>
                      <p className="text-sm text-[#5f6368]">Dominate search terms for your area.</p>
                    </div>
                  </div>
                </div>
                <a href="#" className="inline-flex items-center gap-2 text-[#1a73e8] font-bold hover:underline">
                  See how they did it <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services / Problem Section */}
        <section id="services" className="section-container">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold text-[#202124] mb-6 uppercase tracking-tight">THE INVISIBLE <span className="text-[#ea4335] italic font-normal">CATASTROPHE.</span></h2>
            <p className="text-xl text-[#5f6368] max-w-3xl mx-auto">93% of customers will never find you on page 2. If you aren't visible, you don't exist.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Info size={28} />, 
                title: "THE GHOST TOWN", 
                mistake: "No photos, wrong address, and zero reviews.", 
                impact: "Customers go to the cleaner-looking coin-op 2 miles away.",
                result: "$2,000 - $5,000 MO LOST"
              },
              { 
                icon: <Target size={28} />, 
                title: "MISSING INFO", 
                mistake: "Hours aren't listed. Phone number is wrong.", 
                impact: "Customers call, get no answer, and move on instantly.",
                result: "80% BOUNCE RATE"
              },
              { 
                icon: <Shield size={28} />, 
                title: "ZERO TRUST", 
                mistake: "Blurry photos. No brand personality.", 
                impact: "First impressions are fatal in the laundry business.",
                result: "0% CONVERSION"
              }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 rounded-[2.5rem] bg-[#f8f9fa] border border-[#dadce0] hover:bg-white hover:shadow-premium transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#dadce0] flex items-center justify-center text-[#1a73e8] mb-10 group-hover:scale-110 transition-transform shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#202124] mb-8 tracking-tight uppercase">{item.title}</h3>
                <div className="space-y-6 mb-12">
                   <div>
                     <p className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-[0.2em] mb-2">The Mistake</p>
                     <p className="text-sm text-[#5f6368] italic font-medium">"{item.mistake}"</p>
                   </div>
                   <div>
                     <p className="text-[11px] font-bold text-[#202124] uppercase tracking-[0.2em] mb-2">The Impact</p>
                     <p className="text-sm text-[#3c4043] leading-relaxed line-clamp-3">{item.impact}</p>
                   </div>
                </div>
                <div className="pt-8 border-t border-[#dadce0] flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#5f6368] uppercase tracking-widest">Revenue Lost:</span>
                  <span className="text-sm font-bold text-[#ea4335] tracking-tight">{item.result}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Digital Monopoly / Image Background CTA */}
        <section className="bg-[#1a73e8] py-24 md:py-40 relative overflow-hidden text-center md:text-left">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter uppercase">UNFAIR<br /><span className="text-blue-200">ADVANTAGES.</span></h2>
              <p className="text-xl text-blue-100 mb-12 max-w-xl leading-relaxed">
                Why we dominate while others fail. We use proprietary AI and algorithmic targeting to ensure neighborhood supremacy.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-12">
                {[
                  { icon: <Bot />, title: "AI EXTRACTION" },
                  { icon: <Zap />, title: "BRAND MAGIC" },
                  { icon: <Target />, title: "LOCAL CORE" },
                  { icon: <Shield />, title: "ENCRYPTION" }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20">
                    <div className="text-white shrink-0">{f.icon}</div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{f.title}</span>
                  </div>
                ))}
              </div>
              <Link to="/signup" className="inline-block bg-white text-[#1a73e8] px-12 py-5 rounded-full font-bold hover:bg-blue-50 transition-all shadow-2xl">Start Your Growth</Link>
            </div>
            <div className="relative group">
               <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full" />
               <img 
                src="/digital_growth_laundromat_1772568502083.png" 
                alt="Growth Visualization" 
                className="relative z-10 w-full rounded-[3rem] shadow-2xl border-4 border-white/20 transition-transform duration-700 group-hover:rotate-2 group-hover:scale-105"
               />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2" />
        </section>

        {/* Pricing Section - Exact Retail Aesthetic */}
        <section id="pricing" className="section-container">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-[#202124] mb-6 uppercase tracking-tight">INVEST IN <span className="text-[#1a73e8] italic font-normal">DOMINANCE.</span></h2>
            <p className="text-xl text-[#5f6368]">One-time payments. Long-term customer growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "297", desc: "For small shops ready for a professional presence.", features: ["Full GMB Optimization", "Localized SEO Audit", "10 High-Res Photos", "48h Rapid Delivery"] },
              { name: "Professional", price: "497", desc: "Our most popular package for serious contenders.", features: ["25 Premium Assets", "Kinetic Intro Video", "Competitor Keyword Hijack", "Review Generation Tool"], popular: true },
              { name: "Premium", price: "897", desc: "Full-scale neighborhood monopoly status.", features: ["Unlimited Media Assets", "360° Virtual Tours", "3mo Narrative Strategy", "Direct Expert Access"] }
            ].map((pkg, i) => (
              <div key={i} className={cn(
                "p-12 rounded-[2.5rem] border flex flex-col transition-all duration-300",
                pkg.popular ? "border-[#1a73e8] bg-white shadow-premium scale-105 z-10" : "border-[#dadce0] bg-[#f8f9fa] hover:border-[#1a73e8] hover:bg-white"
              )}>
                {pkg.popular && (
                  <div className="self-start bg-[#e8f0fe] text-[#1a73e8] text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-8">
                    Best Value
                  </div>
                )}
                <h3 className="text-sm font-bold text-[#5f6368] uppercase tracking-[0.2em] mb-4">{pkg.name}</h3>
                <div className="flex items-start gap-1 mb-6">
                  <span className="text-2xl font-bold mt-2 text-[#202124]">$</span>
                  <span className="text-7xl font-bold tracking-tighter text-[#202124]">{pkg.price}</span>
                </div>
                <p className="text-sm text-[#5f6368] leading-relaxed mb-10">{pkg.desc}</p>
                
                <div className="h-px bg-[#dadce0] mb-10 shadow-sm" />
                
                <ul className="space-y-5 mb-12 flex-grow">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-4 text-[14px] text-[#3c4043] font-medium">
                      <Check size={18} className="text-[#1a73e8] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                
                <Link to="/signup" className={cn(
                  "w-full py-5 rounded-full font-bold transition-all text-center",
                  pkg.popular ? "bg-[#1a73e8] text-white hover:bg-[#1557b0] shadow-glow" : "bg-white text-[#1a73e8] border border-[#dadce0] hover:bg-[#f8f9fa]"
                )}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap / How it works */}
        <section id="roadmap" className="bg-[#f8f9fa] py-24 md:py-40 border-y border-[#f1f3f4]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
               <h2 className="text-5xl md:text-8xl font-bold text-[#202124] leading-none uppercase tracking-tighter">THE<br /><span className="text-[#1a73e8]">ROADMAP.</span></h2>
               <p className="max-w-md text-lg text-[#5f6368] border-l-4 border-[#1a73e8] pl-10 leading-relaxed italic">
                 A proven four-step process to secure your position as the top laundromat in your city.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: <Bot />, title: "INTELLIGENCE", desc: "Paste your URL. Our AI extracts your conversion data instantly." },
                { icon: <Target />, title: "PRECISION", desc: "Every address, hour, and phone number perfected for search." },
                { icon: <Shield />, title: "SECURE", desc: "One-time checkout with bank-grade AES-256 encryption." },
                { icon: <Rocket />, title: "LAUNCH", desc: "Dominating local search results in under 48 hours." }
              ].map((step, i) => (
                <div key={i} className="p-12 rounded-[2.5rem] bg-white border border-[#dadce0] group hover:border-[#1a73e8] transition-all relative overflow-hidden">
                  <div className="w-16 h-16 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] flex items-center justify-center text-[#1a73e8] mb-10 group-hover:bg-[#1a73e8] group-hover:text-white transition-all shadow-sm relative z-10">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[#202124] mb-6 uppercase tracking-wider relative z-10">{step.title}</h3>
                  <p className="text-sm text-[#5f6368] leading-relaxed italic relative z-10">"{step.desc}"</p>
                  <div className="absolute -bottom-10 -right-6 text-[120px] font-black text-[#f1f3f4] group-hover:text-[#e8f0fe] transition-colors tabular-nums opacity-50 z-0">0{i+1}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ - Refined Styling */}
        <section id="faq" className="section-container pb-32">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-bold text-[#202124] mb-6 uppercase tracking-tight">QUESTIONS?</h2>
            <p className="text-[13px] font-bold text-[#1a73e8] uppercase tracking-[0.3em]">Transparent answers for serious owners.</p>
          </div>
          <div className="max-w-4xl mx-auto divide-y divide-[#dadce0] border-y border-[#dadce0]">
            {[
              { 
                q: "HOW FAST IS RAPID DELIVERY?", 
                a: "We guarantee 48-hour delivery from the moment you submit your business info. Often, we launch in under 24 because we understand time is money." 
              },
              { 
                q: "IS MY SECURITY GUARANTEED?", 
                a: "We never ask for your password. You simply add us as a manager to your profile using our secure system. Your credentials stay purely with you." 
              },
              { 
                q: "CAN I CUSTOMIZE THE OUTPUT?", 
                a: "Absolutely. You can review all assets before launch or have our AI auto-optimize for max ROI. You maintain 100% control over your brand." 
              }
            ].map((faq, i) => (
              <div key={i} className="py-2 transition-all hover:bg-[#f8f9fa]">
                <button 
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left p-8 flex justify-between items-center group bg-transparent"
                >
                  <span className="font-bold text-[#202124] uppercase tracking-wider text-[15px]">{faq.q}</span>
                  <motion.div 
                    animate={{ rotate: activeFaq === i ? 180 : 0 }}
                    className="w-10 h-10 rounded-full bg-[#f1f3f4] flex items-center justify-center text-[#1a73e8] group-hover:bg-[#1a73e8] group-hover:text-white transition-all shadow-sm"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-10 max-w-2xl">
                        <p className="text-base text-[#5f6368] leading-relaxed italic border-l-4 border-[#1a73e8] pl-8">
                          "{faq.a}"
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer - Final High-Fidelity */}
      <footer className="bg-[#f8f9fa] border-t border-[#dadce0] pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-24">
            <div className="col-span-1 lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-8 group shrink-0">
                <div className="w-12 h-12 bg-[#1a73e8] rounded-2xl flex items-center justify-center text-white font-bold text-xl italic transition-all group-hover:rotate-12 group-hover:scale-110 shadow-lg">E8</div>
                <span className="text-3xl font-medium text-[#202124]">Productions</span>
              </Link>
              <p className="text-xl font-light text-[#5f6368] max-w-sm mb-10 italic">"We don't build profiles.<br />We build monopolies."</p>
              <div className="flex gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white border border-[#dadce0] flex items-center justify-center text-[#5f6368] hover:text-[#1a73e8] hover:border-[#1a73e8] transition-all cursor-pointer shadow-sm">
                    <Star size={18} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-[#202124] mb-8 uppercase tracking-[0.3em]">Platform</h4>
              <ul className="space-y-4">
                {['Services', 'Pricing', 'Roadmap', 'Strategy'].map(f => (
                  <li key={f}><a href="#" className="text-sm font-medium text-[#5f6368] hover:text-[#1a73e8] hover:tracking-widest transition-all uppercase tracking-wider text-[11px]">{f}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-[#202124] mb-8 uppercase tracking-[0.3em]">Company</h4>
              <ul className="space-y-4">
                {['About', 'Success Stores', 'News', 'Contact'].map(f => (
                  <li key={f}><a href="#" className="text-sm font-medium text-[#5f6368] hover:text-[#1a73e8] hover:tracking-widest transition-all uppercase tracking-wider text-[11px]">{f}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-[#202124] mb-8 uppercase tracking-[0.3em]">Support</h4>
              <ul className="space-y-4">
                {['Help Center', 'Trust & Safety', 'Legal'].map(f => (
                  <li key={f}><a href="#" className="text-sm font-medium text-[#5f6368] hover:text-[#1a73e8] hover:tracking-widest transition-all uppercase tracking-wider text-[11px]">{f}</a></li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-[#dadce0] flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold text-[#5f6368] uppercase tracking-[0.4em]">
              <span>© 2026 E8 PRODUCTIONS</span>
              <a href="#" className="hover:text-[#1a73e8] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#1a73e8] transition-colors">Terms</a>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-bold text-[#1a73e8] uppercase tracking-[0.2em] bg-[#e8f0fe] px-6 py-2.5 rounded-full ring-1 ring-[#1a73e8]/20 shadow-sm">
               <div className="w-2.5 h-2.5 rounded-full bg-[#34a853] animate-pulse" />
               High-Performance Infrastructure Active
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
