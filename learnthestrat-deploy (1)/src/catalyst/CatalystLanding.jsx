import React, { useEffect, useRef, useState } from 'react';
import { Activity, ArrowRight, CalendarClock, CheckCircle, Clock, Crosshair, Layers, ListChecks, Timer, Zap } from 'lucide-react';
import EmailCaptureForm from './EmailCaptureForm';
import PdfCover from './PdfCover';
import { track } from './analytics';

// ========================================
// CUSTOMIZE THESE
// ========================================
const GUIDE = {
  // Put the real cover in /public and set e.g. '/catalyst-cover.png'. null = styled mockup.
  coverImage: null,
};
// ========================================

// Visual language mirrors the homepage (src/learnthestrat.com.jsx): black + slate
// gradient background, green-500 accents, frosted cards, gradient green buttons.

const ScrollReveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
};

const Eyebrow = ({ children }) => (
  <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-full border border-green-500/30 bg-green-500/5 backdrop-blur-xl">
    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
    <span className="text-xs sm:text-sm font-semibold tracking-wide text-green-300">{children}</span>
  </div>
);

const SectionHeading = ({ eyebrow, title, subtitle, center = true }) => (
  <div className={`mb-10 sm:mb-16 ${center ? 'text-center' : ''}`}>
    {eyebrow && <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-green-400 mb-3 sm:mb-4">{eyebrow}</p>}
    <h2 className="text-3xl sm:text-5xl font-black tracking-tight">{title}</h2>
    {subtitle && <p className={`text-gray-400 text-base sm:text-lg mt-4 leading-relaxed ${center ? 'max-w-2xl mx-auto' : ''}`}>{subtitle}</p>}
  </div>
);

const CARD = 'rounded-xl sm:rounded-2xl border border-green-500/15 bg-gradient-to-br from-green-500/10 via-transparent to-transparent backdrop-blur-xl';

const CATALYST_EVENTS = [
  'Earnings',
  'Economic releases',
  'Investor events',
  'Product announcements',
  'Company guidance',
  'Sector news',
  'Scheduled events',
];

const LEARN_ITEMS = [
  { icon: Layers, title: 'The 7 Major Catalyst Types', desc: 'The events I keep on watch when looking for potential volatility.' },
  { icon: ListChecks, title: 'How I Build My Watchlist', desc: 'Why certain tickers make the list before the market even opens.' },
  { icon: CalendarClock, title: 'Scheduled vs. Unscheduled', desc: 'Events you can prepare for beforehand vs. news that hits unexpectedly.' },
  { icon: Activity, title: 'How To Trade The Reaction', desc: "The news itself isn't the trade. Price action still has to confirm." },
  { icon: Clock, title: 'When To Look At The Charts', desc: 'Know when a ticker deserves your attention instead of staring at charts all day.' },
  { icon: Crosshair, title: 'Catalysts + The Strat', desc: 'Combine the reason for volatility with structured price action to find entries.' },
];

const FRAMEWORK = [
  { num: '01', title: 'Catalyst', desc: 'Something gives traders a reason to pay attention.' },
  { num: '02', title: 'Reaction', desc: 'We watch how price actually responds.' },
  { num: '03', title: 'Confirmation', desc: 'Price action and The Strat confirm direction and structure.' },
  { num: '04', title: 'Execution', desc: 'We take the trade with defined risk.' },
];

const OPTIONS_POINTS = [
  { label: 'What', desc: 'to watch' },
  { label: 'Why', desc: "you're watching it" },
  { label: 'When', desc: 'volatility may appear' },
];

export default function CatalystLanding() {
  const [subscribed, setSubscribed] = useState(null);
  const heroInputRef = useRef(null);
  const heroFormRef = useRef(null);

  useEffect(() => {
    track('catalyst_page_view', { referrer: document.referrer || undefined });
  }, []);

  // Secondary CTAs scroll back to the hero form and focus the email field.
  const goToForm = (location) => {
    track('catalyst_cta_click', { location });
    heroFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => heroInputRef.current?.focus({ preventScroll: true }), 500);
  };

  const formProps = { subscribed, onSuccess: setSubscribed };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Background — same treatment as the homepage */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black pointer-events-none"></div>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-green-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-[800px] max-w-full h-[600px] bg-gradient-to-b from-green-500/15 via-green-500/5 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-40"></div>
      </div>

      {/* Nav — homepage logo, single CTA */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-3xl bg-black/40 border-b border-green-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-5 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 sm:w-12 h-10 sm:h-12 rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-black border border-green-500/20 flex items-center justify-center shadow-lg shadow-green-500/10 overflow-hidden">
              <svg className="w-6 sm:w-8 h-6 sm:h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect x="25" y="30" width="50" height="40" rx="4" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
                <rect x="30" y="25" width="40" height="30" rx="3" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.8" />
                <path d="M35 35 L65 35" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />
                <path d="M35 45 L65 45" stroke="#22c55e" strokeWidth="1.5" opacity="0.5" />
              </svg>
            </div>
            <span className="font-black tracking-tight text-sm sm:text-base">Learn The Strat</span>
          </div>

          {!subscribed && (
            <button
              onClick={() => goToForm('nav')}
              className="relative group px-4 sm:px-7 py-2.5 sm:py-3 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm overflow-hidden shadow-xl shadow-green-500/30 whitespace-nowrap"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 group-hover:from-green-500 group-hover:to-green-700"></div>
              <span className="relative z-10 text-black">
                <span className="sm:hidden">Free Guide</span>
                <span className="hidden sm:inline">Get the Free Catalyst Guide</span>
              </span>
            </button>
          )}
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="relative z-20 px-4 sm:px-8 pt-24 sm:pt-36 lg:pt-40 pb-16 sm:pb-24">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="mb-5 sm:mb-8">
                <Eyebrow>FREE TRADING GUIDE</Eyebrow>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.02] tracking-tighter mb-5 sm:mb-8">
                Stop Watching Charts All Day.{' '}
                <span className="bg-gradient-to-r from-green-200 via-green-400 to-green-500 bg-clip-text text-transparent">
                  Know When Volatility Is Coming.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-gray-300 leading-relaxed mb-3 sm:mb-4 font-light max-w-2xl mx-auto lg:mx-0">
                Most traders start with the chart and hope something moves. Catalysts give you a reason to have a ticker on watch in the first place.
              </p>
              <p className="text-base sm:text-xl text-gray-300 leading-relaxed mb-7 sm:mb-10 font-light max-w-2xl mx-auto lg:mx-0">
                Learn the <span className="text-green-300 font-semibold">7 types of catalysts</span> I use to find potential volatility, then combine them with price action to execute the trade.
              </p>

              <div id="get-guide" ref={heroFormRef} className="max-w-xl mx-auto lg:mx-0 scroll-mt-28">
                <EmailCaptureForm
                  {...formProps}
                  source="hero"
                  inputRef={heroInputRef}
                  note="100% free. Get the PDF sent directly to your inbox."
                />
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <PdfCover imageSrc={GUIDE.coverImage} className="w-56 sm:w-72 lg:w-80" />
            </div>
          </div>
        </section>

        {/* Problem / insight */}
        <section className="relative z-20 py-16 sm:py-28 px-4 sm:px-8 border-t border-green-500/10">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <SectionHeading eyebrow="THE BETTER QUESTION" title="Ask a Better Question Every Morning" />
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
              <ScrollReveal delay={100}>
                <div className="h-full p-6 sm:p-10 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
                  <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gray-500 mb-4">MOST TRADERS ASK</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-400 leading-snug">“What should I trade today?”</p>
                  <p className="mt-4 text-sm sm:text-base text-gray-500 leading-relaxed">So they scan hundreds of charts hoping something moves.</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="h-full p-6 sm:p-10 rounded-xl sm:rounded-2xl border-2 border-green-500/40 bg-gradient-to-br from-green-500/15 via-black/40 to-black backdrop-blur-xl shadow-2xl shadow-green-500/20">
                  <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-green-400 mb-4">A BETTER QUESTION</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white leading-snug">“Where is volatility likely to show up today?”</p>
                  <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">Start with the events that bring attention into a stock, then go to the chart.</p>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal>
              <div className="text-center">
                <p className="text-sm sm:text-base text-gray-400 mb-5 sm:mb-6">Events that create attention and potential volatility:</p>
                <ul className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-3xl mx-auto">
                  {CATALYST_EVENTS.map((event) => (
                    <li
                      key={event}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-green-500/25 bg-green-500/5 text-sm sm:text-base font-semibold text-green-200"
                    >
                      {event}
                    </li>
                  ))}
                </ul>
                <p className="mt-8 sm:mt-10 text-lg sm:text-2xl font-semibold max-w-2xl mx-auto leading-relaxed">
                  Once you know what matters and when it happens,{' '}
                  <span className="text-green-400">your trading day becomes much more structured.</span>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* What you'll learn */}
        <section className="relative z-20 py-16 sm:py-28 px-4 sm:px-8 border-t border-green-500/10">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <SectionHeading eyebrow="INSIDE THE PDF" title="What You’ll Learn Inside" />
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {LEARN_ITEMS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={item.title} delay={(idx % 3) * 100} className="h-full">
                    <div className={`group h-full p-6 sm:p-8 ${CARD} hover:border-green-500/40 hover:bg-green-500/15 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/20`}>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-5 sm:mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                        <Icon size={22} className="text-black" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-green-300 transition-colors tracking-tight">{item.title}</h3>
                      <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            {!subscribed && (
              <ScrollReveal>
                <div className="mt-10 sm:mt-14 text-center">
                  <button
                    onClick={() => goToForm('learn')}
                    className="w-full sm:w-auto group relative px-8 sm:px-10 py-4 sm:py-5 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 text-base shadow-2xl shadow-green-500/40 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-600 group-hover:from-green-500 group-hover:via-green-600 group-hover:to-green-700 transition-all duration-300"></div>
                    <span className="relative z-10 text-black flex items-center justify-center gap-2">
                      Get the Free Catalyst Guide
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>

        {/* Framework */}
        <section className="relative z-20 py-16 sm:py-28 px-4 sm:px-8 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 border-t border-b border-green-500/10">
          <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <ScrollReveal>
              <SectionHeading
                eyebrow="THE FRAMEWORK"
                title="Catalyst → Reaction → Confirmation → Execution"
                subtitle="The catalyst tells us where and when attention may come into the market. It doesn’t tell us direction. That’s price action’s job."
              />
            </ScrollReveal>

            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {FRAMEWORK.map((step, idx) => (
                <li key={step.num} className="relative">
                  <ScrollReveal delay={idx * 120} className="h-full">
                    <div className={`group h-full p-6 sm:p-8 ${CARD} hover:border-green-500/40 transition-all duration-500`}>
                      <div className="flex items-center gap-4 lg:block">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30 lg:mb-6">
                          <span className="text-lg sm:text-xl font-black text-black">{step.num}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight lg:mb-2">{step.title}</h3>
                      </div>
                      <p className="mt-3 lg:mt-0 text-sm sm:text-base text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </ScrollReveal>
                  {idx < FRAMEWORK.length - 1 && (
                    <ArrowRight
                      size={20}
                      aria-hidden="true"
                      className="hidden lg:block absolute top-1/2 -right-[18px] -translate-y-1/2 text-green-500/60 z-10"
                    />
                  )}
                </li>
              ))}
            </ol>

            <ScrollReveal>
              <div className="mt-12 sm:mt-16 text-center">
                <p className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Trade the <span className="bg-gradient-to-r from-green-200 via-green-400 to-green-500 bg-clip-text text-transparent">reaction</span>,
                  <br className="sm:hidden" /> not the prediction.
                </p>
                <p className="mt-4 sm:mt-6 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                  This isn’t about buying because good news came out or shorting because bad news did. We let price show us the trade.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Options traders */}
        <section className="relative z-20 py-16 sm:py-28 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal>
              <p className="text-xs sm:text-sm font-bold tracking-[0.2em] text-green-400 mb-3 sm:mb-4">FOR OPTIONS TRADERS</p>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-5 sm:mb-6">When You Trade Weeklies or 0DTE, Timing Matters.</h2>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                You don’t have unlimited time to wait for a move. Theta doesn’t care how good your thesis is. Knowing when attention is likely to arrive helps you focus on the right ticker at the right time.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={150}>
              <div className={`p-6 sm:p-10 ${CARD} border-green-500/30`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Timer size={20} className="text-green-400" />
                  </div>
                  <p className="font-bold text-base sm:text-lg">Catalysts help narrow down:</p>
                </div>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {OPTIONS_POINTS.map((p) => (
                    <li key={p.label} className="flex gap-3 items-center">
                      <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-base sm:text-lg">
                        <span className="font-bold text-white">{p.label}</span> {p.desc}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="pt-5 sm:pt-6 border-t border-green-500/15 flex gap-3 items-start">
                  <Zap size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Then <span className="text-white font-semibold">price action determines whether there is actually a trade.</span>
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative z-20 py-16 sm:py-28 px-4 sm:px-8 border-t border-green-500/10 bg-gradient-to-b from-green-500/5 via-transparent to-transparent">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-5xl font-black mb-5 sm:mb-6 tracking-tight">Stop Guessing What To Watch.</h2>
              <p className="text-base sm:text-xl text-gray-400 mb-8 sm:mb-10 leading-relaxed">
                Build your watchlist around events that can actually create volatility, then let price action tell you whether there’s a trade.
              </p>
              <div className="max-w-xl mx-auto">
                <EmailCaptureForm {...formProps} source="final_cta" note="Free PDF delivered directly to your inbox." />
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <footer className="relative z-20 border-t border-green-500/10 py-10 sm:py-16 px-4 sm:px-8 bg-black/50 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto text-center text-gray-600 text-xs sm:text-sm">
          <p className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold">© {new Date().getFullYear()} TheStrat</p>
          <p className="text-xs leading-relaxed max-w-2xl mx-auto">
            Educational content only, not financial advice. Trading options involves substantial risk. Past performance does not guarantee future results. Only trade capital you can afford to lose.
          </p>
        </div>
      </footer>
    </div>
  );
}
