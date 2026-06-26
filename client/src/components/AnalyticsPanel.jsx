import { useState, useEffect } from 'react';
import { fetchAnalyticsSummary, fetchAnalyticsByZone, fetchAnalyticsByStatus, fetchRecentActivity, fetchTickets, timeAgo } from '../api/client';
import StatCard from './ui/StatCard';
import LoadingSpinner from './ui/LoadingSpinner';
import { ClipboardList, Clock, AlertOctagon, ThumbsUp, ShieldCheck } from 'lucide-react';

const statusColors = {
  OPEN: '#f59e0b',
  ASSIGNED: '#3b82f6',
  IN_PROGRESS: '#8b5cf6',
  RESOLVED: '#10b981',
  REJECTED: '#f43f5e',
};

const priorityColors = {
  LOW: '#3b82f6',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#e11d48',
};

export default function AnalyticsPanel() {
  const [summary, setSummary] = useState(null);
  const [byZone, setByZone] = useState([]);
  const [byStatus, setByStatus] = useState([]);
  const [activity, setActivity] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAnalyticsSummary(),
      fetchAnalyticsByZone(),
      fetchAnalyticsByStatus(),
      fetchRecentActivity(),
      fetchTickets(),
    ])
      .then(([s, z, st, a, tRes]) => {
        setSummary(s);
        setByZone(z.data || []);
        setByStatus(st.data || []);
        setActivity(a.activities || []);
        setTickets(tRes?.tickets || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading analytics..." />;
  if (!summary) return null;

  // Compute max for bars
  const maxZone = Math.max(...byZone.map((d) => d.count), 1);
  const totalStatus = byStatus.reduce((a, b) => a + b.count, 0) || 1;

  // Donut data
  let cumulativePercent = 0;
  const donutSegments = byStatus.map((d) => {
    const pct = (d.count / totalStatus) * 100;
    const start = cumulativePercent;
    cumulativePercent += pct;
    return { ...d, pct, start, color: statusColors[d.status] || '#cbd5e1' };
  });

  // Build conic-gradient string
  const conicStops = donutSegments
    .map((s) => `${s.color} ${s.start}% ${s.start + s.pct}%`)
    .join(', ');

  // Priority data
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const priorityData = priorities.map(p => {
    const count = tickets.filter(t => t.priority === p).length;
    return { priority: p, count, color: priorityColors[p] || '#cbd5e1' };
  });
  const slaBreachedCount = tickets.filter(t => t.sla_breached).length;

  // Meaningful Advanced Analytics Metrics (replacing redundant status counts)
  const criticalHighCount = tickets.filter(t => t.priority === 'CRITICAL' || t.priority === 'HIGH').length;
  const totalUpvotes = tickets.reduce((acc, t) => acc + (t.upvotes_count || 0), 0);
  const slaCompliance = tickets.length > 0 
    ? (((tickets.length - slaBreachedCount) / tickets.length) * 100).toFixed(1) + '%'
    : '100%';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Overview of civic infrastructure reporting metrics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={<ClipboardList className="w-6 h-6 text-blue-600" />} label="Total Issues" value={summary.total} color="blue" delay={0} />
        <StatCard icon={<AlertOctagon className="w-6 h-6 text-amber-600" />} label="High & Critical" value={criticalHighCount} color="amber" delay={100} />
        <StatCard icon={<ThumbsUp className="w-6 h-6 text-violet-600" />} label="Community Upvotes" value={totalUpvotes} color="violet" delay={200} />
        <StatCard icon={<ShieldCheck className="w-6 h-6 text-emerald-600" />} label="SLA Compliance" value={slaCompliance} color="emerald" delay={300} />
        <StatCard icon={<Clock className="w-6 h-6 text-rose-600" />} label="Avg Hrs to Resolve" value={summary.avgResolutionHours ? String(Math.round(summary.avgResolutionHours * 10) / 10) : '—'} color="rose" delay={400} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Donut Chart — Status Distribution */}
        <div className="ui-card p-6 animate-fade-in-up bg-white" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
          <h3 className="text-sm font-semibold text-slate-900 mb-6">Status Distribution</h3>
          <div className="flex flex-col items-center">
            <div
              className="w-40 h-40 rounded-full relative"
              style={{
                background: `conic-gradient(${conicStops || '#f1f5f9 0% 100%'})`,
              }}
            >
              {/* Center hole */}
              <div className="absolute inset-5 rounded-full bg-white flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{totalStatus}</p>
                  <p className="text-xs text-slate-500">Total</p>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="mt-6 w-full space-y-2">
              {donutSegments.map((s) => (
                <div key={s.status} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-slate-700">{s.status?.replace('_', ' ')}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-xs">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Bar Chart — Zone Breakdown */}
        <div className="ui-card p-6 animate-fade-in-up bg-white" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <h3 className="text-sm font-semibold text-slate-900 mb-6">Issues by Zone</h3>
          <div className="space-y-3">
            {byZone.length === 0 && <p className="text-sm text-slate-500">No data available.</p>}
            {byZone.map((d, i) => (
              <div key={d.zone_name || i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 truncate max-w-[150px]">{d.zone_name}</span>
                  <span className="text-slate-500 font-mono">{d.count}</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bar-animate bg-gradient-to-r from-blue-500 to-violet-500"
                    style={{ width: `${(d.count / maxZone) * 100}%`, animationDelay: `${i * 100}ms` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Priority Impact & SLA Health Card (replaces empty vertical bar chart) */}
        <div className="ui-card p-6 animate-fade-in-up bg-white flex flex-col justify-between" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Priority & SLA Telemetry</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated dispatch compliance targets</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold shadow-sm ${slaBreachedCount > 0 ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                {slaBreachedCount} SLA Breach{slaBreachedCount === 1 ? '' : 'es'}
              </span>
            </div>

            {/* SLA Overall Health Meter */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mb-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700">System SLA Rating</span>
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                {slaCompliance}
              </span>
            </div>

            {/* Beautiful Horizontal Stacked List */}
            <div className="space-y-3">
              {[
                { priority: 'CRITICAL', label: 'Critical', sla: '2h SLA Target', color: '#e11d48', bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700' },
                { priority: 'HIGH', label: 'High', sla: '24h SLA Target', color: '#f97316', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700' },
                { priority: 'MEDIUM', label: 'Medium', sla: '48h SLA Target', color: '#f59e0b', bg: 'bg-amber-50/50', border: 'border-amber-100/50', text: 'text-amber-600' },
                { priority: 'LOW', label: 'Low', sla: '7d SLA Target', color: '#3b82f6', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700' },
              ].map((pData) => {
                const item = priorityData.find(d => d.priority === pData.priority) || { count: 0 };
                const maxCount = Math.max(...priorityData.map(x => x.count), 1);
                const widthPct = (item.count / maxCount) * 100;
                return (
                  <div key={pData.priority} className="p-3 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all bg-white shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${pData.bg} ${pData.border} ${pData.text}`}>
                          {pData.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{pData.sla}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-800 font-mono">{item.count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${widthPct}%`, backgroundColor: pData.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="ui-card p-6 animate-fade-in-up bg-white flex flex-col" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex-shrink-0">Recent Activity</h3>
        {activity.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity.</p>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[450px] overflow-y-auto overscroll-contain touch-pan-y pr-2 pt-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent block w-full">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs flex-shrink-0 border border-blue-100 text-blue-700">
                  {(a.user_name || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-900">{a.user_name || 'System'}</span>{' '}
                    {a.activity_type === 'STATUS_CHANGE' ? (
                      <>changed <span className="text-slate-500">{a.old_status}</span> → <span className="text-blue-600 font-medium">{a.new_status}</span></>
                    ) : (
                      a.activity_type?.toLowerCase().replace('_', ' ')
                    )}
                    {a.ticket_title && (
                      <span className="text-slate-500"> on <span className="text-slate-700">{a.ticket_title}</span></span>
                    )}
                  </p>
                  {a.note && <p className="text-xs text-slate-500 mt-0.5">{a.note}</p>}
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0 whitespace-nowrap">{timeAgo(a.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
