import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-slate-50 text-slate-900 animate-fade-in">
      
      {/* 1. SPECTACULAR HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50 to-blue-50/40 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-8 shadow-sm animate-fade-in">
            <span>✨</span> Next-Generation Civic Engagement Platform
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
              <span>🚀</span> Report an Issue Now
            </Link>
            <Link
              to="/map"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-700 bg-white border border-slate-300 rounded-2xl hover:bg-slate-50 transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🗺️</span> View Live Heatmap
            </Link>
          </div>

          {/* Quick Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mb-16 animate-fade-in-up">
            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm text-center hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mx-auto mb-3">📈</div>
              <p className="text-3xl font-extrabold text-slate-900">120+</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Total Reports</p>
            </div>
            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm text-center hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-3">✅</div>
              <p className="text-3xl font-extrabold text-emerald-600">85</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Issues Resolved</p>
            </div>
            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm text-center hover:border-amber-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto mb-3">⚡</div>
              <p className="text-3xl font-extrabold text-amber-600">25</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">In Progress</p>
            </div>
            <div className="p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm text-center hover:border-violet-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl mx-auto mb-3">⏱️</div>
              <p className="text-3xl font-extrabold text-violet-600">10</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Pending SLA</p>
            </div>
          </div>

          {/* Gorgeous Wide Hero Banner */}
          <div className="max-w-6xl mx-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl relative overflow-hidden text-left flex flex-col lg:flex-row items-center justify-between gap-8 animate-fade-in">
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
                <span className="text-2xl">🤖</span>
                <div>
                  <h4 className="text-sm font-bold text-white">AI Smart Triage</h4>
                  <p className="text-xs text-slate-200">Emergency keyword scanning & auto-routing</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 shadow-inner">
                <span className="text-2xl">📡</span>
                <div>
                  <h4 className="text-sm font-bold text-white">Direct Telemetry</h4>
                  <p className="text-xs text-slate-200">High-precision HTML5 geolocation tagging</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 shadow-inner">
                <span className="text-2xl">⏱️</span>
                <div>
                  <h4 className="text-sm font-bold text-white">Real-Time SLAs</h4>
                  <p className="text-xs text-slate-200">Enforced municipal dispatch deadlines</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. ABOUT OUR MISSION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Civic Values</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">About Our Mission</h2>
          <p className="text-slate-500 text-base mt-3 max-w-2xl mx-auto">
            Our platform empowers citizens to report, track, and resolve everyday issues in their community. Transform local governance through real-time, map-driven civic action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🌿</div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Clean & Green</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dedicated to maintaining sustainable urban infrastructure, pristine public parks, and beautifully kept neighborhood spaces.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🛡️</div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Trust & Transparency</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Open municipal data feeds ensure complete accountability, clear communication channels, and visible public progress.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🤝</div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Community Driven</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Built for active citizens, collaborative neighborhoods, and proactive civic associations working together for public welfare.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">⚡</div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Efficient Resolution</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Automated AI dispatching and enforced service level agreements guarantee the fastest possible municipal response times.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (STEPPER) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-100/80 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Step-By-Step Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">How Panchayat Transforms Communities</h2>
            <p className="text-slate-500 text-base mt-3 max-w-2xl mx-auto">
              From identifying an everyday hazard to verifying its full municipal resolution, our four-step workflow keeps everyone connected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <span className="absolute top-4 right-6 text-5xl font-black text-slate-100 pointer-events-none">01</span>
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md">1</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Report an Issue</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Citizen identifies an infrastructure glitch, inputs details, and pins the exact location through our simple report form.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <span className="absolute top-4 right-6 text-5xl font-black text-slate-100 pointer-events-none">02</span>
              <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md">2</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Smart Triage</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our AI instantly evaluates the hazard, scans for emergency keywords, assigns priority level, and routes to the correct department.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <span className="absolute top-4 right-6 text-5xl font-black text-slate-100 pointer-events-none">03</span>
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md">3</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Active SLA Resolution</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Municipal authorities receive automated real-time alerts and dispatch maintenance teams within guaranteed resolution windows.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <span className="absolute top-4 right-6 text-5xl font-black text-slate-100 pointer-events-none">04</span>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mb-6 shadow-md">4</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Track & Verify</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Citizens receive real-time status notifications, verify completed repairs, and participate in public community feeds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POWERFUL FEATURES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Platform Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Powerful Features</h2>
          <p className="text-slate-500 text-base mt-3 max-w-2xl mx-auto">
            Everything citizens and municipal engineers need to achieve world-class smart city governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: '📍', title: 'Simple Reporting Form', desc: 'Pinpoint issues on an interactive map in seconds with precise GPS telemetry.' },
            { icon: '✨', title: 'AI Heuristic Triage', desc: 'Auto-categorization & emergency keyword scanning to route issues instantly.' },
            { icon: '⏱️', title: 'Real-Time SLA Tracking', desc: 'Visual breach warnings and automated escalation for municipal engineers.' },
            { icon: '💬', title: 'Civic Community Feed', desc: 'Public discussion threads and "Affects me too" community upvoting.' },
            { icon: '📊', title: 'Executive Analytics', desc: 'Comprehensive breakdown of priority tiers, SLA compliance, and status distribution.' },
            { icon: '📥', title: 'Enterprise Export', desc: 'Download tabular CSV datasets instantly for official municipal and government reporting.' },
            { icon: '🗺️', title: 'Live City Heatmap', desc: 'Real-time geospatial issue tracking across all city zones and districts.' },
            { icon: '🔒', title: 'End-to-End Verified', desc: 'Secure role-based access control for citizens, engineers, and municipal administrators.' },
          ].map((feat, idx) => (
            <div key={idx} className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">{feat.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LIVE STATISTICS & WHY THIS MATTERS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-100/80 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          
          {/* Heroic Callout Banner */}
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

          <div className="text-center mb-16">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">Community Impact</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Why This Matters</h2>
            <p className="text-slate-500 text-base mt-3 max-w-2xl mx-auto">
              A smart city is built on trust, rapid feedback loops, and collective civic pride.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-3xl shrink-0">💖</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Quality of Life</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Smooth roads, clean streets, functioning drainage, and reliable public lighting elevate everyday living standards for all families.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl shrink-0">🏛️</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Good Governance</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Real-time data feeds establish clear communication channels between citizens and leaders, eliminating bureaucratic black holes.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl shrink-0">🌳</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Environmental Impact</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rapid response to clean water leaks, hazardous blockages, and waste accumulation preserves local ecosystems and conserves resources.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-3xl shrink-0">🤝</div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Community Unity</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A shared civic platform fosters strong, collaborative, and proud neighborhoods where everyone plays an active role in public welfare.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Clear Answers</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-base mt-3 max-w-2xl mx-auto">
            Everything you need to know about reporting, AI triage, and municipal resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { q: 'How do I report an issue?', a: 'Click the "Report Issue" button, enter a brief title, pinpoint the location on the interactive map, and submit. It takes less than 30 seconds!' },
            { q: 'What is AI Smart Assist?', a: 'Our built-in AI scans your description for emergency keywords to automatically assign the correct municipal category and priority level.' },
            { q: 'Can I report anonymously?', a: 'Yes! You can toggle "Anonymous Filing" on the report form to mask your user profile details on the public community feed.' },
            { q: 'What happens if an SLA is breached?', a: 'If an issue exceeds its guaranteed resolution window, it triggers a visual high-priority alert for municipal supervisors and department heads.' },
            { q: 'Who resolves the tickets?', a: 'Certified municipal engineers and public works department heads are assigned to investigate, update status, and resolve reported issues.' },
            { q: 'Is my personal data secure?', a: 'Absolutely. We utilize enterprise-grade encryption, secure role-based access control, and strict privacy masking protocols.' },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-3">{faq.q}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION BANNER */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-[3rem] p-12 sm:p-20 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6">
              Ready to transform your <span className="underline decoration-blue-300 decoration-wavy">Community?</span>
            </h2>
            <p className="text-slate-200 text-lg sm:text-xl leading-relaxed mb-10">
              Join thousands of active citizens and dedicated municipal engineers making an immediate impact today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/report"
                className="w-full sm:w-auto px-10 py-5 text-base font-bold text-slate-900 bg-white rounded-2xl hover:bg-slate-50 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>🚀</span> Get Started Now
              </Link>
              <Link
                to="/map"
                className="w-full sm:w-auto px-10 py-5 text-base font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>🗺️</span> Explore Live Map
              </Link>
            </div>
          </div>
        </div>
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
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Citizen Rights Charter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SLA Undertaking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Disclosures</a></li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">Contact Municipal HQ</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2"><span>📍</span> Municipal Plaza, Suite 400</li>
              <li className="flex items-center gap-2"><span>📞</span> +1 (800) 555-CIVIC</li>
              <li className="flex items-center gap-2"><span>✉️</span> support@civicportal.gov</li>
              <li className="flex items-center gap-2 text-emerald-400 font-semibold mt-4"><span>🟢</span> All Systems Normal</li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Civic Portal Enterprise. All rights reserved.</p>
          <div className="flex gap-6">
            <span>🛡️ End-to-End Verified</span>
            <span>⚡ AI Powered</span>
            <span>📊 Open Data Standard</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
