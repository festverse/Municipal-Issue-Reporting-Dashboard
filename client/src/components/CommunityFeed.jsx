import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTickets, toggleUpvoteTicket, timeAgo } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ui/Toast';
import StatusBadge from './ui/StatusBadge';
import PriorityBadge from './ui/PriorityBadge';
import LoadingSpinner from './ui/LoadingSpinner';
import { Search, Filter, ThumbsUp, MessageSquare, MapPin, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function CommunityFeed() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadFeed = async () => {
    try {
      const res = await fetchTickets({ page: 1, limit: 100 });
      setTickets(res.tickets || []);
    } catch (err) {
      showToast('Failed to load community feed: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpvote = async (id) => {
    if (!user) {
      showToast('Please log in to upvote issues.', 'warning');
      return;
    }
    try {
      const res = await toggleUpvoteTicket(id);
      setTickets(prev => prev.map(t => {
        if (t.id === id) {
          return {
            ...t,
            upvotes_count: res.upvoted ? (t.upvotes_count || 0) + 1 : Math.max(0, (t.upvotes_count || 0) - 1)
          };
        }
        return t;
      }));
      showToast(res.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = (t.title && t.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (t.zone_name && t.zone_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (t.category_name && t.category_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner text="Loading public community feed..." />;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-fade-in">
      {/* Spectacular Header Banner */}
      <div className="mb-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Civic Community Feed</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Public Civic Discussion & Updates
          </h1>
          <p className="text-slate-100 text-sm sm:text-base leading-relaxed">
            Track real-time issue resolutions, browse verified evidence photos, participate in community discussion threads, and upvote issues that affect your neighborhood.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, zone, category..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:block">Status:</span>
          {['ALL', 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-blue-500/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Cards Grid */}
      {filteredTickets.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No community issues found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your search query or status filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTickets.map((t, index) => {
            const dummyImages = [
              'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80',
              'https://images.unsplash.com/photo-1542013936693-88937e862b50?auto=format&fit=crop&w=600&q=80'
            ];
            const displayImg = t.media_url || dummyImages[index % dummyImages.length];
            return (
              <div key={t.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 items-start">
                {/* Left Media Thumbnail / Icon */}
                <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0 relative group">
                  <img src={displayImg} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {t.priority && (
                  <div className="absolute top-3 left-3">
                    <PriorityBadge priority={t.priority} />
                  </div>
                )}
              </div>

              {/* Center Content */}
              <div className="flex-1 min-w-0 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                      {t.category_name || 'Civic Issue'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {t.zone_name || 'City Zone'}
                    </span>
                  </div>
                  <StatusBadge status={t.status} />
                </div>

                <div>
                  <Link to={`/ticket/${t.id}`} className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors block mb-1.5 truncate">
                    {t.title}
                  </Link>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 whitespace-pre-wrap">
                    {t.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
                  <div>
                    <span>Reported by </span>
                    <span className="font-bold text-slate-800">{t.reporter_name || t.citizen_name || 'Anonymous Citizen'}</span>
                    <span> • {timeAgo(t.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpvote(t.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold rounded-xl transition-all shadow-sm"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                      <span>Affects me ({t.upvotes_count || 0})</span>
                    </button>

                    <Link
                      to={`/ticket/${t.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl transition-all shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Discuss</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
