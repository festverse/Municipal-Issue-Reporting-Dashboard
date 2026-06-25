import { Link } from 'react-router-dom';
import { Sparkles, Rocket, MapPin, TrendingUp, CheckCircle2, Zap, Timer, Bot, Radio, Leaf, ShieldCheck, Users, MessageSquare, BarChart3, Download, Map, Lock, Heart, Landmark, TreePine, Phone, Mail, Shield } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';

export default function LandingPage() {
  return (
    <div className="bg-slate-50 text-slate-900 animate-fade-in">
      
      {/* 1. SPECTACULAR HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-blue-50/40 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-8 shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Next-Generation Civic Engagement Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6 max-w-5xl mx-auto animate-fade-in-up">
            Report Today, Build Tomorrow's <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Future.</span>
          </h1>

          <p className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-10 max-w-3xl mx-auto animate-fade-in-up">
            A smart platform that connects citizens and municipal authorities to resolve civic problems like potholes, garbage, drainage, and streetlights with real-time updates and AI transparency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up">
            <Link
              to="/report"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5 text-white" />
              <span>Report an Issue Now</span>
            </Link>
            <Link
              to="/map"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-700 bg-white border border-slate-300 rounded-2xl hover:bg-slate-50 transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5 text-slate-700" />
              <span>View Live Heatmap</span>
            </Link>
          </div>

          {/* Quick Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mb-16 animate-fade-in-up">
            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm text-center hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3"><TrendingUp className="w-6 h-6 text-blue-600" /></div>
              <p className="text-3xl font-extrabold text-slate-900">120+</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Total Reports</p>
            </div>
            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm text-center hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3"><CheckCircle2 className="w-6 h-6 text-emerald-600" /></div>
              <p className="text-3xl font-extrabold text-emerald-600">85</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Issues Resolved</p>
            </div>
            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm text-center hover:border-amber-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-3"><Zap className="w-6 h-6 text-amber-600" /></div>
              <p className="text-3xl font-extrabold text-amber-600">25</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">In Progress</p>
            </div>
            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm text-center hover:border-violet-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-3"><Timer className="w-6 h-6 text-violet-600" /></div>
              <p className="text-3xl font-extrabold text-violet-600">10</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Pending SLA</p>
            </div>
          </div>

          {/* Gorgeous Wide Hero Banner */}
          <ScrollReveal direction="up">
            <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden text-left flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-200 block mb-2">Municipal Innovation</span>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">From Everyday Problems to Community-Driven Solutions</h2>
                <p className="text-slate-200 text-base mt-4 leading-relaxed">
                  Experience the future of civic tech. Our platform couples robust real-time telemetry with automated AI triage to guarantee active accountability.
                </p>
              </div>
              <div className="flex flex-col gap-4 w-full lg:w-auto">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 shadow-inner">
                  <Bot className="w-6 h-6 text-blue-200" />
                  <div>
                    <h4 className="text-sm font-bold text-white">AI Smart Triage</h4>
                    <p className="text-xs text-slate-200">Emergency keyword scanning & auto-routing</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 shadow-inner">
                  <Radio className="w-6 h-6 text-blue-200" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Direct Telemetry</h4>
                    <p className="text-xs text-slate-200">High-precision HTML5 geolocation tagging</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 shadow-inner">
                  <Timer className="w-6 h-6 text-blue-200" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Real-Time SLAs</h4>
                    <p className="text-xs text-slate-200">Enforced municipal dispatch deadlines</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* 2. ABOUT OUR MISSION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Civic Values</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">About Our Mission</h2>
            <p className="text-slate-500 text-base mt-3 max-w-2xl mx-auto">
              Our platform empowers citizens to report, track, and resolve everyday issues in their community. Transform local governance through real-time, map-driven civic action.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ScrollReveal direction="up" delay={100} className="h-full">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6"><Leaf className="w-7 h-7 text-emerald-600" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Clean & Green</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Dedicated to maintaining sustainable urban infrastructure, pristine public parks, and beautifully kept neighborhood spaces.
                </p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200} className="h-full">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6"><ShieldCheck className="w-7 h-7 text-blue-600" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Trust & Transparency</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Open municipal data feeds ensure complete accountability, clear communication channels, and visible public progress.
                </p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={300} className="h-full">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-violet-200 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mb-6"><Users className="w-7 h-7 text-violet-600" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Community Driven</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Built for active citizens, collaborative neighborhoods, and proactive civic associations working together for public welfare.
                </p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={400} className="h-full">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-amber-200 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6"><Zap className="w-7 h-7 text-amber-600" /></div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Efficient Resolution</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Automated AI dispatching and enforced service level agreements guarantee the fastest possible municipal response times.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. HOW IT WORKS (STEPPER) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-100/80 border-y border-slate-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          
          {/* Top Left Header & CTA Button */}
          <div className="relative z-10 lg:max-w-xl mb-16 lg:mb-0">
            <ScrollReveal direction="up">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                How Civic Portal<br />Transforms Communities
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                Civic Portal is like Google Maps for civic issues - citizens report problems with one tap, government departments get auto-notified, and everyone can track resolution in real-time. We're making local governance transparent, accountable, and community-driven.
              </p>
              <Link to="/report" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:-translate-y-0.5 text-base sm:text-lg">
                Start Reporting Issues in Your Area
              </Link>
            </ScrollReveal>
          </div>

          {/* Desktop Visual Curved Flow */}
          <div className="hidden lg:block relative mt-12 pb-16">
            {/* Glowing SVG Wave Path */}
            <div className="absolute top-0 left-0 pointer-events-none overflow-visible w-full h-[450px]">
              <svg viewBox="0 0 1200 450" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="blue_gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="50%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                  <filter id="wave_shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#0284c7" floodOpacity="0.3" />
                  </filter>
                  <filter id="box_shadow" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.12" />
                  </filter>
                </defs>

                {/* Smooth glowing curved line */}
                <path d="M 50 250 C 250 400, 400 380, 550 250 C 700 120, 850 300, 980 60 C 1030 10, 1070 30, 1100 40" stroke="url(#blue_gradient)" strokeWidth="8" strokeLinecap="round" filter="url(#wave_shadow)" />

                {/* Node 1 */}
                <g transform="translate(260, 325)">
                  <rect x="-35" y="-35" width="70" height="70" rx="24" fill="white" filter="url(#box_shadow)" />
                  <circle cx="0" cy="0" r="14" fill="#2563eb" />
                </g>

                {/* Node 2 */}
                <g transform="translate(625, 210)">
                  <rect x="-35" y="-35" width="70" height="70" rx="24" fill="white" filter="url(#box_shadow)" />
                  <circle cx="0" cy="0" r="14" fill="#2563eb" />
                </g>

                {/* Node 3 */}
                <g transform="translate(980, 60)">
                  <rect x="-35" y="-35" width="70" height="70" rx="24" fill="white" filter="url(#box_shadow)" />
                  <circle cx="0" cy="0" r="14" fill="#2563eb" />
                </g>
              </svg>
            </div>

            {/* 3 Step Content Columns */}
            <div className="grid grid-cols-3 gap-8 relative z-10 w-full">
              {/* Step 1 */}
              <ScrollReveal direction="up" delay={100} className="pl-12 pt-[390px]">
                <div className="relative z-10 pr-8">
                  <div className="absolute -top-4 right-12 text-[10rem] font-black text-slate-200/70 pointer-events-none select-none leading-none font-mono">1</div>
                  <div className="relative z-10 pt-4">
                    <h3 className="text-xl font-bold text-blue-600 mb-3">Report an Issue</h3>
                    <p className="text-base text-slate-600 leading-relaxed max-w-xs">
                      Snap a photo or send a voice/text via app or WhatsApp. Location and category are auto-detected for fast, accurate reporting.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Step 2 */}
              <ScrollReveal direction="up" delay={200} className="pl-16 pt-[275px]">
                <div className="relative z-10 pr-6">
                  <div className="absolute -top-4 right-6 text-[10rem] font-black text-slate-200/70 pointer-events-none select-none leading-none font-mono">2</div>
                  <div className="relative z-10 pt-4">
                    <h3 className="text-xl font-bold text-blue-600 mb-3">Track & Collaborate</h3>
                    <p className="text-base text-slate-600 leading-relaxed max-w-xs">
                      See your report on the live map, attach to similar reports, upvote, and comment — stay informed as the community and officials interact!
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Step 3 */}
              <ScrollReveal direction="up" delay={300} className="pl-20 pt-[125px]">
                <div className="relative z-10 pr-4">
                  <div className="absolute -top-4 right-0 text-[10rem] font-black text-slate-200/70 pointer-events-none select-none leading-none font-mono">3</div>
                  <div className="relative z-10 pt-4">
                    <h3 className="text-xl font-bold text-blue-600 mb-3">Resolve & Verify</h3>
                    <p className="text-base text-slate-600 leading-relaxed max-w-xs">
                      Assigned to the right department, updated in real time, and marked resolved after verification. Earn credits for verified fixes and help improve your neighborhood!
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Mobile / Tablet Fallback Layout */}
          <div className="lg:hidden mt-12 space-y-8">
            {[
              { num: '1', title: 'Report an Issue', desc: 'Snap a photo or send a voice/text via app or WhatsApp. Location and category are auto-detected for fast, accurate reporting.' },
              { num: '2', title: 'Track & Collaborate', desc: 'See your report on the live map, attach to similar reports, upvote, and comment — stay informed as the community and officials interact!' },
              { num: '3', title: 'Resolve & Verify', desc: 'Assigned to the right department, updated in real time, and marked resolved after verification. Earn credits for verified fixes and help improve your neighborhood!' },
            ].map((step, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 100}>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                  <span className="absolute top-4 right-6 text-6xl font-black text-slate-100 pointer-events-none font-mono">0{step.num}</span>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md">{step.num}</div>
                  <h3 className="text-xl font-bold text-blue-600 mb-3">{step.title}</h3>
                  <p className="text-base text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* 4. POWERFUL FEATURES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Platform Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Powerful Features</h2>
            <p className="text-slate-500 text-base mt-3 max-w-2xl mx-auto">
              Everything citizens and municipal engineers need to achieve world-class smart city governance.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <MapPin className="w-6 h-6 text-blue-600" />, title: 'Simple Reporting Form', desc: 'Pinpoint issues on an interactive map in seconds with precise GPS telemetry.' },
            { icon: <Sparkles className="w-6 h-6 text-blue-600" />, title: 'AI Heuristic Triage', desc: 'Auto-categorization & emergency keyword scanning to route issues instantly.' },
            { icon: <Timer className="w-6 h-6 text-blue-600" />, title: 'Real-Time SLA Tracking', desc: 'Visual breach warnings and automated escalation for municipal engineers.' },
            { icon: <MessageSquare className="w-6 h-6 text-blue-600" />, title: 'Civic Community Feed', desc: 'Public discussion threads and "Affects me too" community upvoting.' },
            { icon: <BarChart3 className="w-6 h-6 text-blue-600" />, title: 'Executive Analytics', desc: 'Comprehensive breakdown of priority tiers, SLA compliance, and status distribution.' },
            { icon: <Download className="w-6 h-6 text-blue-600" />, title: 'Enterprise Export', desc: 'Download tabular CSV datasets instantly for official municipal and government reporting.' },
            { icon: <Map className="w-6 h-6 text-blue-600" />, title: 'Live City Heatmap', desc: 'Real-time geospatial issue tracking across all city zones and districts.' },
            { icon: <Lock className="w-6 h-6 text-blue-600" />, title: 'End-to-End Verified', desc: 'Secure role-based access control for citizens, engineers, and municipal administrators.' },
          ].map((feat, idx) => (
            <ScrollReveal key={idx} direction="up" delay={(idx % 4) * 100} className="h-full">
              <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">{feat.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 5. LIVE STATISTICS & WHY THIS MATTERS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-100/80 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          {/* Heroic Callout Banner */}
          <ScrollReveal direction="scale">
            <div className="bg-emerald-700 text-white rounded-[2.5rem] p-10 sm:p-14 shadow-2xl text-center mb-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 opacity-90" />
              <div className="relative z-10 max-w-3xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-200 block mb-2">Transparent Telemetry</span>
                <p className="text-5xl sm:text-7xl font-black text-white mb-4">71%</p>
                <p className="text-lg sm:text-xl font-bold text-emerald-100 mb-6">SLA Resolution Rate</p>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight italic">
                  "When citizens and government work together transparently, extraordinary things happen for our communities."
                </h3>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">Community Impact</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Why This Matters</h2>
              <p className="text-slate-500 text-base mt-3 max-w-2xl mx-auto">
                A smart city is built on trust, rapid feedback loops, and collective civic pride.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal direction="up" delay={100} className="h-full">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-rose-200 transition-all duration-300 hover:-translate-y-1 flex items-start gap-6 h-full">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0"><Heart className="w-7 h-7 text-rose-600" /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Quality of Life</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Smooth roads, clean streets, functioning drainage, and reliable public lighting elevate everyday living standards for all families.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200} className="h-full">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 flex items-start gap-6 h-full">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0"><Landmark className="w-7 h-7 text-blue-600" /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Good Governance</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Real-time data feeds font-bold establish clear communication channels between citizens and leaders, eliminating bureaucratic black holes.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300} className="h-full">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1 flex items-start gap-6 h-full">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0"><TreePine className="w-7 h-7 text-emerald-600" /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Environmental Impact</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Rapid response to clean water leaks, hazardous blockages, and waste accumulation preserves local ecosystems and conserves resources.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={400} className="h-full">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-violet-200 transition-all duration-300 hover:-translate-y-1 flex items-start gap-6 h-full">
                <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center shrink-0"><Users className="w-7 h-7 text-violet-600" /></div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Community Unity</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    A shared civic platform fosters strong, collaborative, and proud neighborhoods where everyone plays an active role in public welfare.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Clear Answers</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-base mt-3 max-w-2xl mx-auto">
              Everything you need to know about reporting, AI triage, and municipal resolution.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { q: 'How do I report an issue?', a: 'Click the "Report Issue" button, enter a brief title, pinpoint the location on the interactive map, and submit. It takes less than 30 seconds!' },
            { q: 'What is AI Smart Assist?', a: 'Our built-in AI scans your description for emergency keywords to automatically assign the correct municipal category and priority level.' },
            { q: 'Can I report anonymously?', a: 'Yes! You can toggle "Anonymous Filing" on the report form to mask your user profile details on the public community feed.' },
            { q: 'What happens if an SLA is breached?', a: 'If an issue exceeds its guaranteed resolution window, it triggers a visual high-priority alert for municipal supervisors and department heads.' },
            { q: 'Who resolves the tickets?', a: 'Certified municipal engineers and public works department heads are assigned to investigate, update status, and resolve reported issues.' },
            { q: 'Is my personal data secure?', a: 'Absolutely. We utilize enterprise-grade encryption, secure role-based access control, and strict privacy masking protocols.' },
          ].map((faq, idx) => (
            <ScrollReveal key={idx} direction="up" delay={(idx % 3) * 100} className="h-full">
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 h-full">
                <h3 className="text-lg font-bold text-slate-900 mb-3">{faq.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION BANNER */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal direction="scale">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-[3rem] p-12 sm:p-20 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
                Ready to transform your Community?
              </h2>
              <p className="text-slate-200 text-lg sm:text-xl leading-relaxed mb-10">
                Join thousands of active citizens and dedicated municipal engineers making an immediate impact today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/report"
                  className="w-full sm:w-auto px-10 py-5 text-base font-bold text-slate-900 bg-white rounded-2xl hover:bg-slate-50 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5 text-slate-900" />
                  <span>Get Started Now</span>
                </Link>
                <Link
                  to="/map"
                  className="w-full sm:w-auto px-10 py-5 text-base font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5 text-white" />
                  <span>Explore Live Map</span>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. GORGEOUS COMPREHENSIVE FOOTER */}
      <footer className="bg-slate-900 text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Col 1 & 2: Branding & Bio */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">Civic Portal</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Empowering smart cities through crowdsourced issue reporting, AI heuristic triage, real-time map telemetry, and enforced service level agreements.
            </p>
            <div>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Subscribe to Municipal Bulletin</p>
              <div className="flex gap-2 max-w-md">
                <input type="email" placeholder="citizen@city.gov" className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500" />
                <button type="button" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white rounded-xl transition-all shadow-sm active:scale-95">Join</button>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/report" className="hover:text-white transition-colors">Report Issue</Link></li>
              <li><Link to="/map" className="hover:text-white transition-colors">Live Heatmap</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Engineer Dashboard</Link></li>
              <li><Link to="/analytics" className="hover:text-white transition-colors">Executive Analytics</Link></li>
            </ul>
          </div>

          {/* Col 4: Legal & Security */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Legal & Governance</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/legal/charter" className="hover:text-white transition-colors">Citizen Rights Charter</Link></li>
              <li><Link to="/legal/sla" className="hover:text-white transition-colors">SLA Undertaking</Link></li>
              <li><Link to="/legal/security" className="hover:text-white transition-colors">Security Disclosures</Link></li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Contact Municipal HQ</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /><span>Municipal Plaza, Suite 400</span></li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /><span>+1 (800) 555-CIVIC</span></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /><span>support@civicportal.gov</span></li>
              <li className="flex items-center gap-2 text-emerald-400 font-semibold mt-4"><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>All Systems Normal</span></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Civic Portal Enterprise. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-slate-500" /> End-to-End Verified</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-slate-500" /> AI Powered</span>
            <span className="flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-slate-500" /> Open Data Standard</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
