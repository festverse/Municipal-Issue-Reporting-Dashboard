import { useState } from 'react';
import { LayoutDashboard, TrendingUp, Users, CheckCircle, Clock, AlertTriangle, Calendar, ArrowUpRight, Sparkles } from 'lucide-react';

export default function GovDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    { title: 'Total Reported Issues', value: '1,284', change: '+12.5%', isPositive: true, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Resolved & Closed', value: '948', change: '+18.2%', isPositive: true, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'In Progress / Assigned', value: '242', change: '-4.3%', isPositive: false, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Citizen Contributions', value: '8,429', change: '+24.8%', isPositive: true, icon: Users, color: 'text-violet-500', bg: 'bg-violet-50' },
  ];

  const recentActivities = [
    { id: 1, title: 'Major Pothole Repair Completed', department: 'Department of Transportation', time: '2 hours ago', image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80', status: 'Completed' },
    { id: 2, title: 'Solar Streetlight Grid Inspection', department: 'Energy & Power Division', time: '5 hours ago', image: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80', status: 'In Progress' },
    { id: 3, title: 'Downtown Water Main Flushing', department: 'Water & Sanitation Board', time: '1 day ago', image: 'https://images.unsplash.com/photo-1542013936693-88937e862b50?auto=format&fit=crop&w=600&q=80', status: 'Completed' },
    { id: 4, title: 'Community Park Landscaping Upgrade', department: 'Parks & Recreation', time: '2 days ago', image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80', status: 'Assigned' },
  ];

  return (
    <div className="lg:col-span-9 xl:col-span-10 h-full overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Municipal Overview & Analytics</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">City Executive Dashboard</h1>
            <p className="text-slate-100 text-sm max-w-2xl leading-relaxed">
              Real-time telemetry and resolution analytics across all 12 civic zones. Monitor department SLA compliance and community impact metrics.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            {['24h', '7d', '30d', '1y'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  timeRange === t ? 'bg-white text-blue-600 shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((st, idx) => {
          const IconComponent = st.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${st.bg}`}>
                  <IconComponent className={`w-6 h-6 ${st.color}`} />
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  st.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {st.change}
                </span>
              </div>
              <div>
                <h4 className="text-3xl font-black text-slate-900 mb-1">{st.value}</h4>
                <p className="text-sm font-medium text-slate-500">{st.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Municipal Activities with Dummy Images */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Field Operations</h3>
              <p className="text-xs text-slate-500 mt-0.5">Verified updates with on-site photo evidence</p>
            </div>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recentActivities.map((act) => (
              <div key={act.id} className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                <div className="h-48 w-full overflow-hidden relative group">
                  <img src={act.image} alt={act.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                      act.status === 'Completed' ? 'bg-emerald-500 text-white' :
                      act.status === 'In Progress' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">{act.department}</span>
                    <h4 className="text-base font-bold text-slate-900 line-clamp-2">{act.title}</h4>
                  </div>
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{act.time}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-bold text-xs">Details →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Key Priority Breakdowns & Action Center */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-900">Priority Level SLAs</h3>
              <p className="text-xs text-slate-500 mt-0.5">Automated resolution compliance targets</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-0.5">CRITICAL PRIORITY</span>
                  <p className="text-sm font-bold text-slate-900">2-Hour Guarantee</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-sm">98.4% Met</span>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-0.5">HIGH PRIORITY</span>
                  <p className="text-sm font-bold text-slate-900">24-Hour Guarantee</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-sm">96.1% Met</span>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-0.5">MEDIUM PRIORITY</span>
                  <p className="text-sm font-bold text-slate-900">48-Hour Guarantee</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm">99.2% Met</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-0.5">LOW PRIORITY</span>
                  <p className="text-sm font-bold text-slate-900">7-Day Maintenance</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-slate-700 text-white text-xs font-bold shadow-sm">99.9% Met</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
            <h4 className="text-base font-bold mb-1">Civic Automation Status</h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">All AI dispatch nodes are fully operational and routing municipal requests instantly.</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>System Nominal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
