import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchTickets, fetchZones, fetchCategories, fetchAnalyticsSummary, updateTicketStatus, generateAINote, timeAgo } from '../api/client';
import { useToast } from './ui/Toast';
import StatCard from './ui/StatCard';
import StatusBadge from './ui/StatusBadge';
import PriorityBadge from './ui/PriorityBadge';
import LoadingSpinner from './ui/LoadingSpinner';
import { Download, ClipboardList, Unlock, Settings, CheckCircle2, Search, AlertCircle, Sparkles } from 'lucide-react';

const statuses = ['All', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

const statusTransitions = {
  OPEN: ['ASSIGNED', 'REJECTED'],
  ASSIGNED: ['IN_PROGRESS', 'REJECTED'],
  IN_PROGRESS: ['RESOLVED', 'REJECTED'],
  RESOLVED: [],
  REJECTED: ['OPEN'],
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [tickets, setTickets] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Reference data
  const [zones, setZones] = useState([]);
  const [categories, setCategories] = useState([]);

  // Summary stats
  const [summary, setSummary] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0 });

  // Modal
  const [modal, setModal] = useState(null); // { ticket, newStatus, note }
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);

  // Load reference data & summary
  useEffect(() => {
    fetchZones().then((d) => setZones(d.zones || [])).catch(() => {});
    fetchCategories().then((d) => setCategories(d.categories || [])).catch(() => {});
    fetchAnalyticsSummary().then((d) => setSummary(d)).catch(() => {});
  }, []);

  // Load tickets
  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters = { page: currentPage, limit: 15 };
      if (search) filters.search = search;
      if (statusFilter !== 'All') filters.status = statusFilter;
      if (zoneFilter) filters.zone_id = zoneFilter;
      if (categoryFilter) filters.category_id = categoryFilter;

      const data = await fetchTickets(filters);
      setTickets(data.tickets || data.rows || []);
      setTotalCount(data.count || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast('Failed to load tickets.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search, statusFilter, zoneFilter, categoryFilter, showToast]);

  useEffect(() => { loadTickets(); }, [loadTickets]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setCurrentPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Status update handler
  const handleStatusUpdate = async () => {
    if (!modal) return;
    try {
      await updateTicketStatus(modal.ticket.id, modal.newStatus, modal.note);
      showToast(`Ticket updated to ${modal.newStatus}`, 'success');
      setModal(null);
      loadTickets();
      fetchAnalyticsSummary().then((d) => setSummary(d)).catch(() => {});
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleAIGenerateNote = async () => {
    if (!modal) return;
    setIsGeneratingNote(true);
    try {
      const res = await generateAINote(modal.ticket.title, modal.ticket.status, modal.newStatus);
      if (res && res.data && res.data.note) {
        setModal({ ...modal, note: res.data.note });
        showToast('AI Note generated successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to generate AI note: ' + err.message, 'error');
    } finally {
      setIsGeneratingNote(false);
    }
  };

  const handleCSVExport = () => {
    if (tickets.length === 0) {
      showToast('No tickets available to export.', 'warning');
      return;
    }
    const headers = ['ID,Title,Category,Zone,Priority,Status,SLA Breached,Created At'];
    const rows = tickets.map(t => 
      `"${t.id}","${t.title.replace(/"/g, '""')}","${t.category_name || ''}","${t.zone_name || ''}","${t.priority}","${t.status}","${t.sla_breached ? 'YES' : 'NO'}","${t.created_at}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `municipal_tickets_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV Export downloaded successfully!', 'success');
  };

  const selectClass = "px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer";

  // Pagination range
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  const visiblePages = pageNumbers.filter(
    (p) => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)
  );
  const breachedTickets = tickets.filter(t => t.sla_breached || t.priority === 'CRITICAL');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-fade-in">
      {/* High-Priority SLA Breach Alert Banner */}
      {breachedTickets.length > 0 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-rose-500 to-red-600 rounded-2xl text-white shadow-lg shadow-rose-500/20 animate-fade-in flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 flex-shrink-0 animate-pulse">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>🚨 IMMEDIATE ACTION REQUIRED: {breachedTickets.length} SLA Breach{breachedTickets.length > 1 ? 'es' : ''} Detected</span>
              </h2>
              <p className="text-sm text-rose-100 mt-0.5 leading-relaxed">
                These tickets have exceeded municipal resolution window guarantees or pose urgent civic hazards. Immediate dispatch required.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {breachedTickets.slice(0, 2).map(t => (
              <Link
                key={t.id}
                to={`/ticket/${t.id}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-rose-700 hover:bg-rose-50 active:scale-95 transition-all rounded-xl text-xs font-bold shadow-sm flex-1 md:flex-none justify-center"
              >
                <span>View #{t.id} ({t.category_name || 'Urgent'}) →</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Header & Quick Controls */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Engineer Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage and track civic infrastructure reports.</p>
        </div>
        <button
          onClick={handleCSVExport}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl shadow-sm transition-all active:scale-95"
        >
          <Download className="w-4 h-4 text-white" />
          <span>Export Enterprise CSV</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<ClipboardList className="w-6 h-6 text-blue-600" />} label="Total Issues" value={summary.total} color="blue" delay={0} />
        <StatCard icon={<Unlock className="w-6 h-6 text-amber-600" />} label="Open" value={summary.open} color="amber" delay={100} />
        <StatCard icon={<Settings className="w-6 h-6 text-violet-600" />} label="In Progress" value={summary.in_progress} color="violet" delay={200} />
        <StatCard icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />} label="Resolved" value={summary.resolved} color="emerald" delay={300} />
      </div>

      {/* Filters */}
      <div className="ui-card p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Zone */}
          <select value={zoneFilter} onChange={(e) => { setZoneFilter(e.target.value); setCurrentPage(1); }} className={selectClass}>
            <option value="">All Zones</option>
            {zones.map((z) => <option key={z.id} value={z.id}>{z.zone_name}</option>)}
          </select>

          {/* Category */}
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} className={selectClass}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Status pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {s === 'All' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="ui-card overflow-hidden">
        {isLoading ? (
          <LoadingSpinner text="Loading tickets..." />
        ) : tickets.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <div className="flex justify-center mb-3"><Search className="w-10 h-10 text-slate-400" /></div>
            <p className="font-medium text-slate-700">No tickets found</p>
            <p className="text-sm mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
                  <th className="px-4 py-3 font-semibold">ID</th>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Zone</th>
                  <th className="px-4 py-3 font-semibold">Priority</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold hidden lg:table-cell">SLA Status</th>
                  <th className="px-4 py-3 font-semibold hidden xl:table-cell">Created</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {tickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/tickets/${t.id}`)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-xs font-mono text-slate-500">#{String(t.id).substring(0, 6)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 max-w-[200px] truncate">{t.title}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg border border-slate-200">{t.category_name || t.category || '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500 hidden md:table-cell">{t.zone_name || t.zone || '—'}</td>
                    <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {t.status === 'RESOLVED' ? (
                        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg inline-flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Fulfilled</span>
                      ) : t.sla_breached ? (
                        <span className="text-xs font-bold px-2 py-1 bg-rose-100 text-rose-700 rounded-lg inline-flex items-center gap-1 animate-pulse-critical"><AlertCircle className="w-3.5 h-3.5 text-rose-600" /> SLA Breached</span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg inline-flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> SLA Normal</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 hidden xl:table-cell">{timeAgo(t.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const valid = statusTransitions[t.status] || [];
                          if (valid.length === 0) { showToast('No status transitions available.', 'info'); return; }
                          setModal({ ticket: t, newStatus: valid[0], note: '' });
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition-all"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500">
              Showing {(currentPage - 1) * 15 + 1}–{Math.min(currentPage * 15, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>
              {visiblePages.map((p, i) => {
                const prev = visiblePages[i - 1];
                return (
                  <span key={p}>
                    {prev && p - prev > 1 && <span className="text-slate-400 px-1">…</span>}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 text-xs rounded-lg transition-all ${
                        p === currentPage
                          ? 'bg-blue-100 text-blue-700 font-bold border border-blue-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                );
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="ui-card relative w-full max-w-md p-6 animate-fade-in-up bg-white">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Update Status</h3>
            <p className="text-sm text-slate-500 mb-6 truncate">{modal.ticket.title}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">New Status</label>
                <select
                  value={modal.newStatus}
                  onChange={(e) => setModal({ ...modal, newStatus: e.target.value })}
                  className={selectClass + ' w-full'}
                >
                  {(statusTransitions[modal.ticket.status] || []).map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Note (optional)</label>
                  <button
                    type="button"
                    onClick={handleAIGenerateNote}
                    disabled={isGeneratingNote}
                    className="flex items-center gap-1 px-2.5 py-1 bg-ai-gradient text-white font-semibold text-xs rounded-lg shadow-sm hover:opacity-95 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isGeneratingNote ? 'Generating...' : <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-white" /> AI Generate Note</span>}
                  </button>
                </div>
                <textarea
                  value={modal.note}
                  onChange={(e) => setModal({ ...modal, note: e.target.value })}
                  rows={4}
                  placeholder="Add a note about this status change..."
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}