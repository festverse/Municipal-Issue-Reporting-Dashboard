import { useState } from 'react';
import { BarChart2, Download, Search, Filter, Calendar, Sparkles, PieChart, FileSpreadsheet, TrendingUp, CheckCircle2, Clock, MessageSquare } from 'lucide-react';

export default function GovReports({ onStartChat }) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const reportLogs = [
    { id: 'REP-1029', title: 'Grand Avenue Repaving Project', category: 'Roads & Streets', zone: 'Zone 4 - Downtown', date: 'June 24, 2026', status: 'Completed', sla: 'Met (18h)', image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80' },
    { id: 'REP-1028', title: 'Sewer Line Rupture Mitigation', category: 'Sanitation', zone: 'Zone 2 - Westside', date: 'June 23, 2026', status: 'In Progress', sla: 'In Buffer (6h left)', image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80' },
    { id: 'REP-1027', title: 'Solar Array Transformer Repair', category: 'Energy & Power', zone: 'Zone 1 - North Hills', date: 'June 22, 2026', status: 'Completed', sla: 'Met (4h)', image: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80' },
    { id: 'REP-1026', title: 'Municipal Water Main Purge', category: 'Water Supply', zone: 'Zone 8 - East Port', date: 'June 20, 2026', status: 'Assigned', sla: 'Dispatched', image: 'https://picsum.photos/id/1029/600/400' },
  ];

  const filteredReports = reportLogs.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="lg:col-span-9 xl:col-span-10 h-full overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Municipal Telemetry & Logs</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Comprehensive Civic Reports & Analytics</h1>
            <p className="text-slate-100 text-sm max-w-2xl leading-relaxed">
              Verify automated resolution records, download authenticated spreadsheet logs, and audit departmental efficiency metrics in real time.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white text-blue-600 hover:bg-slate-50 font-bold text-xs rounded-2xl transition-all shadow-lg active:scale-95 whitespace-nowrap">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Export Verified CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
            <BarChart2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">AGGREGATED AUDITS</span>
            <h4 className="text-2xl font-black text-slate-900">4,912 Reports</h4>
            <p className="text-xs text-emerald-600 font-bold mt-1">✓ 100% Fully Verified</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">SLA SUCCESS RATE</span>
            <h4 className="text-2xl font-black text-slate-900">98.7% On Time</h4>
            <p className="text-xs text-blue-600 font-bold mt-1">Exceeds municipal target</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-amber-50 text-amber-600">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">MEDIAN DISPATCH</span>
            <h4 className="text-2xl font-black text-slate-900">14.2 Minutes</h4>
            <p className="text-xs text-slate-500 font-medium mt-1">Automated AI Routing</p>
          </div>
        </div>
      </div>

      {/* Main Reports Log Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Official Department Report Logs</h3>
            <p className="text-xs text-slate-500 mt-0.5">Filter by audit status or search ticket codes</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit ID, title, zone..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
              {['ALL', 'Completed', 'In Progress', 'Assigned'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    filterStatus === st ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Tables / Cards */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
            <BarChart2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-900 mb-1">No audit logs found</h4>
            <p className="text-xs text-slate-500">Modify your search string or status toggle.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((rep) => (
              <div key={rep.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img src={rep.image} alt={rep.title} className="w-20 h-20 rounded-2xl object-cover border border-slate-200 flex-shrink-0 shadow-inner" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{rep.id}</span>
                      <span className="text-xs font-bold text-slate-400">• {rep.category}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 truncate mb-1">{rep.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{rep.zone}</span>
                      <span>•</span>
                      <span>{rep.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t border-slate-200/60 sm:border-0 gap-2">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onStartChat && onStartChat({ id: 9999, name: 'Citizen Reporter (' + rep.id + ')', role: 'Citizen Elite', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' })} className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-full flex items-center gap-1 transition-all shadow-sm active:scale-95">
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat with Citizen</span>
                    </button>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                      rep.status === 'Completed' ? 'bg-emerald-500 text-white' :
                      rep.status === 'In Progress' ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">SLA: {rep.sla}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
