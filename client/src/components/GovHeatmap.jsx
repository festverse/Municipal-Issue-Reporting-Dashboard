import { useState } from 'react';
import { Map, MapPin, Layers, Filter, Search, Sparkles, Navigation, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function GovHeatmap() {
  const [activeZone, setActiveZone] = useState('ALL');
  const [mapType, setMapType] = useState('heatmap');

  const zones = [
    { id: 1, name: 'Downtown Commercial Core', issues: 42, status: 'Severe Concentration', level: 'high', image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80', activeRepair: 'Main Blvd Repaving' },
    { id: 2, name: 'North Residential Hills', issues: 14, status: 'Stable / Monitored', level: 'low', image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80', activeRepair: 'Power Line Clearances' },
    { id: 3, name: 'Westside Industrial Park', issues: 28, status: 'Elevated Activity', level: 'medium', image: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80', activeRepair: 'Streetlight Grid Overhaul' },
    { id: 4, name: 'East Waterfront District', issues: 9, status: 'SLA Met / Resolved', level: 'optimal', image: 'https://picsum.photos/id/1029/600/400', activeRepair: 'Drainage Pipe Scouring' },
  ];

  return (
    <div className="lg:col-span-9 xl:col-span-10 w-full space-y-6 animate-fade-in">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>AI Spatial Mapping</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Live Heatmap & Incident Radar</h1>
            <p className="text-slate-100 text-sm max-w-2xl leading-relaxed">
              Real-time spatial visualization of active municipal complaints, field crews, and historical issue clusters across all municipal boundaries.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            {[
              { id: 'heatmap', label: 'Thermal Heatmap' },
              { id: 'radar', label: 'Active Crew Radar' },
              { id: 'assets', label: 'City Assets Map' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMapType(m.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  mapType === m.id ? 'bg-white text-blue-600 shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Map & Zone Filter Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Map Viewport */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Spatial Telemetry Grid</h3>
              <p className="text-xs text-slate-500 mt-0.5">Live coordinates synchronized with civic dispatch nodes</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search precise address or landmark..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Simulated Premium Interactive Map */}
          <div className="flex-1 min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 relative group bg-slate-900 shadow-inner">
            {/* Background Map Simulation using high quality Unsplash satellite/city map image */}
            <img
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80"
              alt="Municipal Satellite Map"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            {/* Heatmap Overlay Simulation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 via-indigo-900/20 to-rose-900/40 pointer-events-none" />
            
            {/* Live Incident Radars */}
            <div className="absolute top-1/3 left-1/4 animate-bounce">
              <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-600 border-2 border-white shadow-md"></span>
              </span>
            </div>
            <div className="absolute top-1/2 right-1/3 animate-bounce delay-150">
              <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-amber-500 border-2 border-white shadow-md"></span>
              </span>
            </div>
            <div className="absolute bottom-1/4 left-1/3 animate-bounce delay-300">
              <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-600 border-2 border-white shadow-md"></span>
              </span>
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 pointer-events-auto">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-lg flex items-center gap-3">
                <Navigation className="w-4 h-4 text-blue-600 animate-pulse" />
                <div>
                  <p className="text-[11px] font-bold text-slate-900">GPS Node Active</p>
                  <p className="text-[10px] text-slate-500">Lat: 34.0522° N, Lon: 118.2437° W</p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/80 shadow-lg flex items-center gap-1">
                {['All Layers', 'Complaints', 'Field Crews'].map((lr, i) => (
                  <button key={i} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${i === 0 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}>
                    {lr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Zone Incident Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Zone Telemetry</h3>
              <p className="text-xs text-slate-500 mt-0.5">Active municipal clusters</p>
            </div>
            <Filter className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {zones.map((z) => (
              <div key={z.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4">
                <img src={z.image} alt={z.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900 truncate">{z.name}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                      z.level === 'high' ? 'bg-rose-100 text-rose-700' :
                      z.level === 'medium' ? 'bg-amber-100 text-amber-700' :
                      z.level === 'low' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {z.issues} Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{z.status}</p>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg w-fit">
                    <MapPin className="w-3 h-3" />
                    <span>Active: {z.activeRepair}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
