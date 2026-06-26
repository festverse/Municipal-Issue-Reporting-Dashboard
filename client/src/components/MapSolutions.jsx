import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, MapPin, Sparkles, Navigation, Layers, Shield, Zap, Radio, Search, Filter, CheckCircle2, ArrowRight, Cpu, Eye, BarChart3, TrendingUp } from 'lucide-react';

export default function MapSolutions() {
  const [activeSolution, setActiveSolution] = useState('heatmap');
  const [searchQuery, setSearchQuery] = useState('');

  const solutions = [
    {
      id: 'heatmap',
      title: 'AI Thermal Heatmap',
      subtitle: 'Predictive Infrastructure Clustering',
      description: 'Leverages advanced machine learning algorithms to visualize urban complaint densities, identifying underlying pipe degradations and structural road failures before severe incidents occur.',
      image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
      metrics: { accuracy: '99.4%', activeNodes: '1,420', refreshRate: 'Real-time (500ms)' },
      features: ['Neural Network Anomaly Detection', 'Predictive Pothole Density Mapping', 'Cross-departmental Telemetry Sync']
    },
    {
      id: 'radar',
      title: 'Active Crew Radar & Triage',
      subtitle: 'Dynamic Dispatch & Geospatial Routing',
      description: 'Monitors all live municipal engineering crews across city quadrants. Automatically assigns high-priority complaints to the nearest available unit based on real-time traffic and equipment loadouts.',
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
      metrics: { accuracy: '98.9%', activeNodes: '84 Crews', refreshRate: 'Real-time (1s)' },
      features: ['Automated Route Optimization', 'Equipment Matching AI', 'SLA Breach Proactive Warning']
    },
    {
      id: 'assets',
      title: 'Municipal Asset Monitoring',
      subtitle: 'IoT Grid & Utility Telemetry',
      description: 'Complete GIS tracking of municipal assets including smart streetlights, sewage telemetry sensors, high-voltage microgrid transformers, and public transit terminals.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      metrics: { accuracy: '99.9%', activeNodes: '42,500+ Assets', refreshRate: 'Live Stream' },
      features: ['Preemptive Microgrid Diagnostics', 'Smart Streetlight Status Pings', 'Continuous Pressure Gauging']
    },
    {
      id: 'geofence',
      title: 'Geofenced Incident Triage',
      subtitle: 'Automated Jurisdictional Handoffs',
      description: 'Establishes high-precision smart geofences around special economic zones, historical districts, and municipal ward borders for seamless intra-agency escalation and automated auditing.',
      image: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=1200&q=80',
      metrics: { accuracy: '100%', activeNodes: '16 Districts', refreshRate: 'Instant' },
      features: ['Zero-Latency Jurisdiction Assignment', 'Boundary Audit Tracing', 'Ward-level Citizen Broadcasts']
    }
  ];

  const currentSol = solutions.find(s => s.id === activeSolution) || solutions[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 animate-fade-in pb-24">
      {/* 1. Spectacular Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white border-b border-slate-800">
        {/* Absolute Glowing Auras */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[60%] bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-violet-500/30 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-blue-200 mb-8 shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Next-Generation Spatial Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.15] mb-6 max-w-5xl mx-auto">
            Advanced Municipal <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">Heatmap</span> &<br />Geospatial AI Solutions.
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-3xl mx-auto">
            Empower municipal engineers and civic administrators with military-grade geospatial tracking, AI anomaly clustering, and automated dispatch telemetry across the smart city grid.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/map"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Map className="w-5 h-5 text-white" />
              <span>Launch Live City Map</span>
            </Link>
            <Link
              to="/report"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-900 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Report an Issue Now</span>
            </Link>
          </div>

          {/* Quick Stats Micro-Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
            <div className="text-center border-r border-white/10 last:border-0 pr-4 last:pr-0">
              <div className="flex items-center justify-center gap-1 text-sky-400 mb-1">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Accuracy</span>
              </div>
              <p className="text-2xl font-black text-white">99.4%</p>
            </div>
            <div className="text-center md:border-r border-white/10 last:border-0 pr-4 last:pr-0">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
                <Radio className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Node Latency</span>
              </div>
              <p className="text-2xl font-black text-white">&lt; 500ms</p>
            </div>
            <div className="text-center border-r border-white/10 last:border-0 pr-4 last:pr-0">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                <Navigation className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Crews Tracked</span>
              </div>
              <p className="text-2xl font-black text-white">84 Active</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-violet-400 mb-1">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">GIS Standard</span>
              </div>
              <p className="text-2xl font-black text-white">HTML5 Pro</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Exploration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Architectural Highlights</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Explore Modular Map Solutions</h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
            Select an AI mapping module below to inspect its operational architecture, live telemetry metrics, and municipal integration benefits.
          </p>
        </div>

        {/* Tab Selection Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {solutions.map((sol) => (
            <button
              key={sol.id}
              onClick={() => setActiveSolution(sol.id)}
              className={`px-6 py-4 rounded-2xl text-sm font-bold transition-all flex items-center gap-2.5 shadow-sm active:scale-95 ${
                activeSolution === sol.id
                  ? 'bg-blue-600 text-white shadow-blue-500/25 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {sol.id === 'heatmap' && <Layers className={`w-4 h-4 ${activeSolution === sol.id ? 'text-white' : 'text-blue-600'}`} />}
              {sol.id === 'radar' && <Navigation className={`w-4 h-4 ${activeSolution === sol.id ? 'text-white' : 'text-emerald-600'}`} />}
              {sol.id === 'assets' && <BarChart3 className={`w-4 h-4 ${activeSolution === sol.id ? 'text-white' : 'text-amber-600'}`} />}
              {sol.id === 'geofence' && <Shield className={`w-4 h-4 ${activeSolution === sol.id ? 'text-white' : 'text-violet-600'}`} />}
              <span>{sol.title}</span>
            </button>
          ))}
        </div>

        {/* Premium Solution Showcase Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 animate-fade-in">
          
          {/* Left: Dynamic Viewport & Simulation */}
          <div className="lg:col-span-7 h-[450px] lg:h-auto relative bg-slate-900 overflow-hidden group">
            <img
              src={currentSol.image}
              alt={currentSol.title}
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-900/40 to-transparent" />
            
            {/* Overlay Simulated Floating Telemetry */}
            <div className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white shadow-2xl max-w-xs animate-fade-in-up">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold tracking-wider uppercase text-slate-300">Live Spatial Node</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{currentSol.title} Active</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">Processing ultra-low latency spatial grids via cartographic map sync.</p>
            </div>

            {/* Bottom Floating Stats Bar */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-white shadow-2xl flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-300">Operational Precision</p>
                <p className="text-lg font-black text-sky-400">{currentSol.metrics.accuracy}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-300">Tracked Entities</p>
                <p className="text-lg font-black text-emerald-400">{currentSol.metrics.activeNodes}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-300">Telemetry Sync</p>
                <p className="text-lg font-black text-amber-300">{currentSol.metrics.refreshRate}</p>
              </div>
            </div>
          </div>

          {/* Right: Comprehensive System Details */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-full mb-3">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Module Specification</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                  {currentSol.title}
                </h3>
                <p className="text-sm font-bold text-blue-600 mb-4">
                  {currentSol.subtitle}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {currentSol.description}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Core Technical Capabilities</h4>
                {currentSol.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Link Action */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/map"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 text-center"
              >
                <span>Access Live Telemetry Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Deep-Dive Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-[2.5rem] p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="max-w-2xl relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Ready to transform your municipal workflow?
            </h2>
            <p className="text-slate-100 text-base sm:text-lg leading-relaxed mb-8">
              Whether you are a proactive citizen tracking neighborhood progress or a municipal engineer managing active dispatch grids, our map solutions bring absolute clarity to city governance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/report"
                className="px-8 py-4 bg-white text-blue-600 hover:bg-slate-50 font-bold text-sm rounded-2xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
              >
                <span>Pinpoint an Issue</span>
                <ArrowRight className="w-4 h-4 text-blue-600" />
              </Link>
              <Link
                to="/feed"
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 font-bold text-sm rounded-2xl transition-all active:scale-95 flex items-center gap-2"
              >
                <span>View Community Discussion</span>
              </Link>
            </div>
          </div>
          <div className="relative z-10 bg-slate-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/20 text-left w-full lg:w-96 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Integration Guarantee</span>
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed mb-4">
              All map solutions automatically synchronize with the Civic Portal central ledger, ensuring strict SLA enforcement and public accountability trails.
            </p>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-bold">
              <span>Security Tier</span>
              <span className="text-emerald-400">256-bit AES Encryption</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
