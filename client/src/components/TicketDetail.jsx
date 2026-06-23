import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchTicketById, updateTicketStatus, timeAgo } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ui/Toast';
import StatusBadge from './ui/StatusBadge';
import PriorityBadge from './ui/PriorityBadge';
import LoadingSpinner from './ui/LoadingSpinner';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

const statusTransitions = {
  OPEN: ['ASSIGNED', 'REJECTED'],
  ASSIGNED: ['IN_PROGRESS', 'REJECTED'],
  IN_PROGRESS: ['RESOLVED', 'REJECTED'],
  RESOLVED: [],
  REJECTED: ['OPEN'],
};

const activityIcons = {
  STATUS_CHANGE: '🔄',
  COMMENT: '💬',
  CREATED: '✨',
  ASSIGNED: '👤',
};

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadTicket = async () => {
    try {
      const data = await fetchTicketById(id);
      const t = data.ticket || data;
      setTicket(t);
      const transitions = statusTransitions[t.status] || [];
      if (transitions.length > 0) setNewStatus(transitions[0]);
    } catch (err) {
      showToast('Failed to load ticket.', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTicket(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdate = async () => {
    if (!newStatus) return;
    setUpdating(true);
    try {
      await updateTicketStatus(id, newStatus, note);
      showToast('Status updated!', 'success');
      setNote('');
      await loadTicket();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading ticket details..." />;
  if (!ticket) return null;

  const activities = ticket.activities || [];
  const transitions = statusTransitions[ticket.status] || [];
  const isEngineer = user && (user.role === 'ENGINEER' || user.role === 'ADMIN');
  const hasCoords = ticket.latitude && ticket.longitude;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="ui-card bg-white p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">{ticket.title}</h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-wrap">{ticket.description}</p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                <StatusBadge status={ticket.status} />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Priority</p>
                <PriorityBadge priority={ticket.priority} />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Zone</p>
                <p className="text-sm text-slate-700">{ticket.zone_name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Category</p>
                <p className="text-sm text-slate-700">{ticket.category_name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Reported</p>
                <p className="text-sm text-slate-700">{timeAgo(ticket.created_at)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Reporter</p>
                <p className="text-sm text-slate-700">{ticket.reporter_name || ticket.citizen_name || '—'}</p>
              </div>
            </div>
          </div>

          {/* Map */}
          {hasCoords && (
            <div className="ui-card bg-white overflow-hidden">
              <div className="h-[280px] z-0">
                <MapContainer
                  center={[parseFloat(ticket.latitude), parseFloat(ticket.longitude)]}
                  zoom={15}
                  className="h-full w-full"
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                  />
                  <Marker position={[parseFloat(ticket.latitude), parseFloat(ticket.longitude)]} />
                </MapContainer>
              </div>
              <div className="px-4 py-3 border-t border-slate-200 text-xs text-slate-500 font-mono bg-slate-50">
                📍 {parseFloat(ticket.latitude).toFixed(4)}, {parseFloat(ticket.longitude).toFixed(4)}
              </div>
            </div>
          )}
        </div>

        {/* Right Column — 1/3 */}
        <div className="space-y-6">
          {/* Status Update (for engineers) */}
          {isEngineer && transitions.length > 0 && (
            <div className="ui-card bg-white p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Update Status</h3>
              <div className="space-y-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm outline-none focus:border-blue-500 transition-all appearance-none"
                >
                  {transitions.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:border-blue-500 transition-all resize-none"
                />
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="w-full py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="ui-card bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Activity Timeline</h3>

            {activities.length === 0 ? (
              <p className="text-sm text-slate-500">No activity yet.</p>
            ) : (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-200" />

                <div className="space-y-4">
                  {activities.map((a, i) => (
                    <div key={i} className="flex gap-3 animate-fade-in" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}>
                      {/* Dot */}
                      <div className="relative z-10 w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-xs flex-shrink-0">
                        {activityIcons[a.activity_type] || '📌'}
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700">
                          <span className="font-medium text-slate-900">{a.user_name || 'System'}</span>
                          {a.activity_type === 'STATUS_CHANGE' && (
                            <span> changed status <span className="text-slate-500">{a.old_status}</span> → <span className="text-blue-600 font-medium">{a.new_status}</span></span>
                          )}
                          {a.activity_type === 'COMMENT' && <span> added a comment</span>}
                          {a.activity_type === 'CREATED' && <span> created this ticket</span>}
                        </p>
                        {a.note && <p className="text-xs text-slate-500 mt-0.5 truncate">{a.note}</p>}
                        <p className="text-xs text-slate-400 mt-1">{timeAgo(a.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
