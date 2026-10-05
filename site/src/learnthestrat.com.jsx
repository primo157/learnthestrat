import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Users, Zap, Clock, CheckCircle, Star, ArrowUpRight, Flame, Play, Menu, X, Lock, Gift, Sparkles } from 'lucide-react';

// ========================================
// CUSTOMIZE THESE - Easy config at the top
// ========================================
const SITE_CONFIG = {
  companyName: 'TheStrat',
  tagline: 'Catalyst Trading',
  // Change colors: green-400, green-500, green-600 to blue-400, blue-500, blue-600 etc
  primaryColor: 'green', // 'green', 'blue', 'purple', 'red', 'emerald'
};
// ========================================

const AnimatedHeroText = ({ scrollY }) => {
  const [showText, setShowText] = useState(false);
  const opacity = Math.max(0, 1 - scrollY / 500);

  useEffect(() => {
    setShowText(true);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInLeft {
        0% {
          opacity: 0;
          transform: translateX(-40px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes scaleIn {
        0% {
          opacity: 0;
          transform: scale(0.9) translateY(10px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .hero-slide-in {
        animation: slideInLeft 0.8s ease-out;
      }
      
      .hero-scale-in {
        animation: scaleIn 0.8s ease-out 0.2s both;
      }
      
      .hero-fade-up {
        animation: fadeInUp 1s ease-out 1s both;
      }
    `;
    if (!document.querySelector('style[data-hero-simple]')) {
      style.setAttribute('data-hero-simple', 'true');
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={{ opacity }} className="transition-opacity duration-300 relative">
      {/* Green glow aura behind text */}
      <div className="absolute inset-0 -z-10 blur-3xl bg-gradient-to-b from-green-500/30 via-green-500/20 to-transparent rounded-full scale-110 opacity-60"></div>
      
      <h1 className="text-6xl sm:text-8xl lg:text-10xl font-black leading-[0.95] mb-4 sm:mb-10 tracking-tighter">
        <span className={`block mb-2 sm:mb-4 ${showText ? 'hero-slide-in' : ''}`}>
          Trade with
        </span>
        <span className={`relative inline-block ${showText ? 'hero-scale-in' : ''}`}>
          <span className="relative z-10 bg-gradient-to-r from-green-200 via-green-400 to-green-500 bg-clip-text text-transparent drop-shadow-2xl">
            Precision
          </span>
        </span>
      </h1>

      <p className={`text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12 sm:mb-20 font-light tracking-wide ${showText ? 'hero-fade-up' : ''}`}>
        Elite traders execute systematic, catalyst-driven strategies with mechanical discipline. Live premarket analysis and real-time execution daily.
      </p>
    </div>
  );
};

const ScrollReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
};

const AnimatedGradientBackground = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black pointer-events-none"></div>
  );
};

const Counter = ({ target, label }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 30);

    return () => clearInterval(timer);
  }, [hasStarted, target]);

  return (
    <div ref={ref} className="group p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-500/20 bg-green-500/5 backdrop-blur-sm hover:border-green-500/40 hover:bg-green-500/10 transition-all duration-300 cursor-default transform hover:scale-105">
      <p className="text-xs sm:text-sm text-gray-400 font-semibold mb-1 sm:mb-2">{label}</p>
      <p className="text-2xl sm:text-3xl font-black text-green-400">{count}+</p>
    </div>
  );
};

export default function Landing50K() {
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const candlesRef = useRef([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <AnimatedGradientBackground />
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-green-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/8 rounded-full mix-blend-screen filter blur-3xl opacity-15"></div>
        
        {/* Hero section accent lighting */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-green-500/15 via-green-500/5 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-40"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 backdrop-blur-3xl bg-black/40 border-b border-green-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Logo with dark gradient background */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-2xl opacity-80 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
              <div className="relative w-10 sm:w-12 h-10 sm:h-12 rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-black border border-green-500/20 flex items-center justify-center shadow-lg shadow-green-500/10 group-hover:border-green-500/40 transition-all duration-300 overflow-hidden">
                {/* Logo - will load from imgbb */}
                <svg className="w-6 sm:w-8 h-6 sm:h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="25" y="30" width="50" height="40" rx="4" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.6"/>
                  <rect x="30" y="25" width="40" height="30" rx="3" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.8"/>
                  <path d="M35 35 L65 35" stroke="#22c55e" strokeWidth="1.5" opacity="0.5"/>
                  <path d="M35 45 L65 45" stroke="#22c55e" strokeWidth="1.5" opacity="0.5"/>
                </svg>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-green-500/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <button className="hidden md:block relative group px-7 py-3 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 text-sm overflow-hidden shadow-xl shadow-green-500/30">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 group-hover:from-green-500 group-hover:to-green-700"></div>
            <span className="relative z-10 text-black flex items-center gap-2">
              Join Free Discord
              <Gift size={16} />
            </span>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-green-500/5 bg-black/80 backdrop-blur-xl p-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            <button className="w-full py-3 px-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-300 font-bold rounded-lg transition-all text-sm">
              Join Free Discord
            </button>
            <button className="w-full py-3 px-4 bg-gradient-to-r from-green-400 to-green-600 text-black font-bold rounded-lg transition-all text-sm">
              Start 3-Day Trial
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-8 pt-20 sm:pt-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex justify-center mb-8 sm:mb-12 animate-in fade-in duration-700">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-full border border-green-500/30 bg-green-500/5 backdrop-blur-xl hover:border-green-500/60 transition-colors duration-300">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-xs sm:text-sm font-semibold text-green-300">Catalyst-Driven Trading System</span>
            </div>
          </div>

          <div className="text-center mb-12 sm:mb-16 relative">
            {/* Premium frosted glass backdrop - dark and readable */}
            <div className="absolute inset-0 -z-10 blur-3xl bg-gradient-to-b from-black/70 via-black/50 to-black/30 rounded-full scale-150"></div>
            <div className="absolute inset-0 -z-10 backdrop-blur-lg bg-black/40 rounded-3xl scale-125"></div>
            <div className="absolute inset-0 -z-10 border border-green-500/10 rounded-3xl scale-125"></div>

            <AnimatedHeroText scrollY={scrollY} />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-16 sm:mb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              <button className="w-full sm:w-auto group relative px-8 sm:px-12 py-5 sm:py-6 font-bold rounded-lg transition-all duration-300 transform hover:scale-110 text-base sm:text-lg shadow-2xl shadow-green-500/40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600 group-hover:from-green-500 group-hover:via-green-600 group-hover:to-green-700 transition-all duration-300"></div>
                <span className="relative z-10 text-black flex items-center justify-center gap-2">
                  Start 3-Day Free Trial
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </button>

              <button className="w-full sm:w-auto group relative px-8 sm:px-12 py-5 sm:py-6 border-2 border-green-500/40 rounded-lg transition-all duration-300 hover:border-green-500/80 hover:bg-green-500/5 font-bold text-base sm:text-lg backdrop-blur-sm overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Gift size={18} /> Free Discord
                </span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-8 max-w-2xl mx-auto animate-in fade-in duration-1000 delay-700">
              <Counter target={1000} label="Members" />
              <div className="group p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-500/20 bg-green-500/5 backdrop-blur-sm hover:border-green-500/40 hover:bg-green-500/10 transition-all duration-300 cursor-default transform hover:scale-105">
                <p className="text-xs sm:text-sm text-gray-400 font-semibold mb-1 sm:mb-2">Trading</p>
                <p className="text-2xl sm:text-3xl font-black text-green-400">Daily</p>
              </div>
              <div className="group p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-500/20 bg-green-500/5 backdrop-blur-sm hover:border-green-500/40 hover:bg-green-500/10 transition-all duration-300 cursor-default transform hover:scale-105">
                <p className="text-xs sm:text-sm text-gray-400 font-semibold mb-1 sm:mb-2">Focus</p>
                <p className="text-2xl sm:text-3xl font-black text-green-400">Catalysts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VSL Section */}
      <section className="relative z-20 py-16 sm:py-32 px-4 sm:px-8 border-t border-green-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 sm:mb-12 text-center">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">See It In Action</h2>
              <p className="text-gray-400 text-sm sm:text-lg">Watch how our catalyst trading system works in real-time</p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={100}>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-black shadow-2xl shadow-green-500/20">
              {/* Video placeholder - replace with your VSL embed */}
              <div className="relative w-full aspect-video bg-gradient-to-br from-slate-900 to-black flex items-center justify-center group cursor-pointer">
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl shadow-green-500/50 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold text-sm sm:text-base">Click to watch VSL</p>
                </div>

                {/* Replace this div with your video embed */}
                {/* For YouTube: <iframe width="100%" height="100%" src="https://www.youtube.com/embed/YOUR_VIDEO_ID" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}
                {/* For Loom: <iframe width="100%" height="100%" src="https://www.loom.com/embed/YOUR_VIDEO_ID" frameBorder="0" allowFullScreen></iframe> */}
                {/* For custom video: <video width="100%" height="100%" controls><source src="YOUR_VIDEO_URL" type="video/mp4" /></video> */}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
      <section className="relative z-20 py-16 sm:py-32 px-4 sm:px-8 border-t border-green-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">Everything Included</h2>
              <p className="text-gray-400 text-sm sm:text-lg">Watch how our catalyst trading system works in real-time</p>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-10">
            {[
              { icon: Zap, title: 'Live Premarket Prep', desc: 'Daily analysis identifying catalysts and mechanical setups before market open.' },
              { icon: Users, title: 'Live Trading Room', desc: 'Real-time execution with live commentary. See position management in action.' },
              { icon: Clock, title: 'Daily Watchlists', desc: 'Curated catalyst plays. Ready-to-trade setups based on mechanical signals.' },
              { icon: TrendingUp, title: 'Complete Education', desc: 'Full course covering catalyst identification and the mechanical system.' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={idx} delay={idx * 150}>
                  <div
                    onMouseEnter={() => setHoveredCard(idx)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="group relative p-6 sm:p-12 rounded-lg sm:rounded-2xl border border-green-500/15 bg-gradient-to-br from-green-500/10 via-transparent to-transparent hover:border-green-500/40 hover:bg-green-500/15 transition-all duration-500 cursor-default backdrop-blur-xl overflow-hidden transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-green-500/20"
                  >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/20 rounded-full -mr-24 -mt-24 group-hover:scale-200 transition-transform duration-700 opacity-0 group-hover:opacity-100"></div>

                    <div className="relative z-10">
                      <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4 sm:mb-10 group-hover:scale-125 group-hover:shadow-2xl group-hover:shadow-green-500/50 transition-all duration-300 shadow-lg shadow-green-500/30">
                        <Icon size={24} className="sm:w-8 sm:h-8 text-black" />
                      </div>
                      <h3 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-5 group-hover:text-green-300 transition-colors tracking-tight">{item.title}</h3>
                      <p className="text-gray-400 leading-relaxed text-sm sm:text-lg">{item.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* System Section */}
      <section className="relative z-20 py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 border-t border-b border-green-500/10">
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight">The System In Action</h2>
            <p className="text-gray-400 text-sm sm:text-lg mb-8">Our 4-step catalyst trading framework</p>
          </ScrollReveal>

          <div className="space-y-6 sm:space-y-8">
            {[
              { num: '01', title: 'Identify Catalysts', desc: 'Find high-impact market events' },
              { num: '02', title: 'Mechanical Signal', desc: 'Wait for precise price setup' },
              { num: '03', title: 'Execute', desc: 'Trade with defined risk' },
              { num: '04', title: 'Scale', desc: 'Exit winners, repeat' },
            ].map((step, idx) => (
              <ScrollReveal key={idx} delay={idx * 150}>
                <div className="group relative p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-green-500/15 bg-gradient-to-br from-green-500/10 via-transparent to-transparent hover:border-green-500/40 hover:bg-green-500/15 transition-all duration-500 cursor-default backdrop-blur-xl overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/20">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-green-500/20 rounded-full -mr-24 -mt-24 group-hover:scale-200 transition-transform duration-700 opacity-0 group-hover:opacity-100"></div>

                  <div className="relative z-10 flex gap-4 items-start">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                      <span className="text-xl sm:text-3xl font-black text-black">{step.num}</span>
                    </div>
                    <div className="flex-1 text-left pt-1">
                      <h3 className="text-lg sm:text-2xl font-bold mb-1 group-hover:text-green-300 transition-colors">{step.title}</h3>
                      <p className="text-sm sm:text-base text-gray-400">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-20 py-16 sm:py-32 px-4 sm:px-8 border-t border-green-500/10">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-5xl font-black mb-12 sm:mb-16 tracking-tight">Member Results</h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-10">
            {[
              { quote: 'Mechanical system removed emotion. First significant win in week two. Game-changer.', author: 'Alex M.', role: 'Active Member' },
              { quote: 'Premarket prep saves hours. Watchlist is ready-to-trade. Finally executing with discipline.', author: 'Jordan K.', role: '3 Month Member' },
              { quote: 'Live execution changed everything. Position management and scaling worth every penny.', author: 'Sam T.', role: '6 Month Member' },
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 150}>
                <div className="group p-6 sm:p-12 rounded-lg sm:rounded-2xl border border-green-500/15 bg-gradient-to-br from-green-500/10 via-transparent to-transparent hover:border-green-500/40 hover:bg-green-500/15 transition-all duration-500 backdrop-blur-xl transform hover:-translate-y-2">
                  <div className="flex gap-1 mb-4 sm:mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="sm:w-5 sm:h-5 fill-green-400 text-green-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 sm:mb-10 leading-relaxed italic text-sm sm:text-lg">"{item.quote}"</p>
                  <div className="border-t border-green-500/10 pt-4 sm:pt-8">
                    <p className="font-bold text-white text-sm sm:text-lg">{item.author}</p>
                    <p className="text-xs sm:text-sm text-green-400 font-semibold">{item.role}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-20 py-16 sm:py-32 px-4 sm:px-8 border-t border-green-500/10 bg-gradient-to-b from-green-500/5 to-transparent">
        <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">Two Paths</h2>
              <p className="text-gray-400 text-sm sm:text-lg">Choose what works for you - start free or go all in</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-10 max-w-5xl mx-auto">
            <ScrollReveal delay={100}>
              <div className="relative p-8 sm:p-12 rounded-2xl sm:rounded-3xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 via-black/50 to-black backdrop-blur-xl transform hover:scale-105 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Gift size={24} className="text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Free Discord</h3>
                    <p className="text-sm text-gray-400">Get started today</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-gray-400 text-sm sm:text-base">Free forever access to:</p>
                </div>

                <ul className="space-y-3 sm:space-y-4 mb-10">
                  {[
                    'Community access',
                    'Member chat & support',
                    'Free watchlist alerts',
                    'Market updates',
                    'Educational resources',
                  ].map((feature, idx) => (
                    <li key={idx} className="flex gap-3 items-center transform group hover:translate-x-2 transition-transform">
                      <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full py-4 sm:py-5 border-2 border-green-500/40 hover:border-green-500/80 hover:bg-green-500/5 text-white font-bold rounded-lg transition-all text-sm sm:text-base transform hover:scale-105">
                  Join Free Discord
                </button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="relative p-8 sm:p-12 rounded-2xl sm:rounded-3xl border-2 border-green-500/60 bg-gradient-to-br from-green-500/20 via-black/50 to-black backdrop-blur-xl shadow-2xl shadow-green-500/30 transform hover:scale-105 transition-transform duration-500">
                <div className="absolute -top-6 sm:-top-8 right-8 sm:right-12 px-6 py-2 bg-gradient-to-r from-green-400 to-green-600 text-black text-xs sm:text-xs font-black rounded-full shadow-xl shadow-green-500/40 animate-pulse">
                  RECOMMENDED
                </div>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Lock size={24} className="text-black" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Full Access</h3>
                    <p className="text-sm text-gray-400">Premium membership</p>
                  </div>
                </div>

                <div className="mb-8">
                  <span className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-green-300 to-green-500 bg-clip-text text-transparent">$100</span>
                  <span className="text-gray-400 ml-2 text-lg sm:text-xl">/month</span>
                </div>

                <ul className="space-y-3 sm:space-y-4 mb-10">
                  {[
                    'Everything in Free, plus:',
                    'Live premarket prep daily',
                    'Live trading room',
                    'Daily watchlists',
                    'Complete education course',
                    'Direct access to me',
                  ].map((feature, idx) => (
                    <li key={idx} className="flex gap-3 items-start transform group hover:translate-x-2 transition-transform">
                      {idx === 0 ? (
                        <span className="text-green-400 font-bold text-sm sm:text-base">{feature}</span>
                      ) : (
                        <>
                          <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <button className="w-full relative py-4 sm:py-5 text-black font-black rounded-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-green-500/50 text-sm sm:text-base overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600 group-hover:from-green-500 group-hover:via-green-600 group-hover:to-green-700 transition-all duration-300"></div>
                  <span className="relative z-10">Start 3-Day Free Trial</span>
                </button>

                <p className="text-xs sm:text-sm text-gray-500 mt-6 font-semibold text-center">No credit card required. Cancel anytime.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-20 py-16 sm:py-32 px-4 sm:px-8 border-t border-green-500/10 bg-gradient-to-b from-green-500/5 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-5xl font-black mb-6 sm:mb-8 tracking-tight">This Is Your Moment</h2>
            <p className="text-lg sm:text-2xl text-gray-400 mb-12 sm:mb-16 max-w-3xl mx-auto leading-relaxed">1000+ traders are already executing systematic catalyst strategies. Start with free access or go premium. No credit card needed.</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group relative px-10 sm:px-14 py-5 sm:py-7 text-black font-black rounded-lg transition-all duration-300 transform hover:scale-110 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-xl shadow-2xl shadow-green-500/40 overflow-hidden w-full sm:w-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600 group-hover:from-green-500 group-hover:via-green-600 group-hover:to-green-700 transition-all duration-300"></div>
                <span className="relative z-10">Start Free Trial</span>
                <ArrowUpRight size={20} className="relative z-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform hidden sm:block" />
              </button>

              <button className="px-10 sm:px-14 py-5 sm:py-7 border-2 border-green-500/40 rounded-lg hover:border-green-500/80 hover:bg-green-500/5 font-black text-base sm:text-xl transition-all w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 transform hover:scale-105">
                <Gift size={20} /> Free Discord
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-green-500/10 py-12 sm:py-20 px-4 sm:px-8 bg-black/50 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-xs sm:text-sm">
          <p className="mb-4 sm:mb-8 text-base sm:text-xl font-semibold">© 2025 TheStrat</p>
          <p className="text-xs leading-relaxed max-w-2xl mx-auto">Trading involves substantial risk. Past performance does not guarantee future results. Only trade capital you can afford to lose.</p>
        </div>
      </footer>
    </div>
  );
}