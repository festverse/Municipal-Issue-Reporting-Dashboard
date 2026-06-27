import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchTickets, toggleUpvoteTicket } from '../api/client';
import { useToast } from './ui/Toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Map, AlertOctagon, Circle, RefreshCw, CheckCircle2, ThumbsUp } from 'lucide-react';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

export default function CityMap() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const cityCenter = [21.1750, 72.8350];

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await fetchTickets({ limit: 100 });
      setTickets(res.tickets || []);
    } catch (err) {
      showToast('Failed to fetch map data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (ticketId) => {
    if (!user) {
      showToast('Please log in to upvote issues.', 'warning');
      return;
    }
    try {
      const res = await toggleUpvoteTicket(ticketId);
      setTickets(tickets.map(t => {
        if (t.id === ticketId) {
          return { ...t, upvotes_count: res.upvoted ? (t.upvotes_count || 0) + 1 : Math.max(0, (t.upvotes_count || 0) - 1) };
        }
        return t;
      }));
      showToast(res.message, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const filteredTickets = tickets.filter(t => {
    if (filter === 'ALL') return true;
    if (filter === 'CRITICAL') return t.priority === 'CRITICAL';
    return t.status === filter;
  });

  return (
    <div data-lenis-prevent="true" className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 animate-fade-in">
      {/* Top Controls Overlay Bar */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 z-20 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-600" />
            <span>City Live Issue Map</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time geospatial visualization of civic infrastructure repairs & reports.</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
          {[
            { label: 'All Issues', value: 'ALL', icon: null },
            { label: 'Critical', value: 'CRITICAL', icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-600" /> },
            { label: 'Open', value: 'OPEN', icon: <Circle className="w-3.5 h-3.5 text-amber-500" /> },
            { label: 'In Progress', value: 'IN_PROGRESS', icon: <RefreshCw className="w-3.5 h-3.5 text-violet-600" /> },
            { label: 'Resolved', value: 'RESOLVED', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === tab.value
                  ? 'bg-blue-600 text-white shadow-sm scale-105'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="flex-1 w-full relative z-0">
        {loading ? (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30">
            <span className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full" style={{ animation: 'spin-ring 0.6s linear infinite' }} />
            <span className="text-xs font-semibold text-slate-600 tracking-wider uppercase">Loading Geospatial Data...</span>
          </div>
        ) : null}

        <MapContainer center={cityCenter} zoom={13} className="h-full w-full">
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          />
          {filteredTickets.map((ticket) => (
            <Marker key={ticket.id} position={[ticket.latitude, ticket.longitude]}>
              <Popup className="custom-popup">
                <div className="p-1 min-w-[240px] text-slate-900">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      ticket.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700 animate-pulse-critical' :
                      ticket.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {ticket.priority}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {ticket.zone_name || 'Municipal Zone'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{ticket.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{ticket.description}</p>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleUpvote(ticket.id)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all rounded-xl text-xs font-bold text-slate-700 shadow-sm border border-slate-200/60"
                    >
                      <ThumbsUp className="w-4 h-4 text-blue-600" />
                      <span>Affects me ({ticket.upvotes_count || 0})</span>
                    </button>
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all rounded-xl text-xs font-black !text-white shadow-lg shadow-blue-500/30 border border-blue-400/30 flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
