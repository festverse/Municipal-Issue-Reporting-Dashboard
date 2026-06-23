import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createTicket, fetchZones, fetchCategories } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ui/Toast';
import { Link } from 'react-router-dom';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

function LocationPicker({ position, setPosition }) {
  useMapEvents({ click(e) { setPosition(e.latlng); } });
  return position ? <Marker position={position} /> : null;
}

const priorities = [
  { value: 'LOW',      label: 'Low',      bg: 'bg-slate-50',  text: 'text-slate-700',  border: 'border-slate-200' },
  { value: 'MEDIUM',   label: 'Medium',   bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  { value: 'HIGH',     label: 'High',     bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  { value: 'CRITICAL', label: 'Critical', bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200' },
];

export default function TicketForm() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [position, setPosition] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zones, setZones] = useState([]);
  const [categories, setCategories] = useState([]);

  const cityCenter = [21.1702, 72.8311];

  useEffect(() => {
    fetchZones().then((d) => setZones(d.zones || [])).catch(() => {});
    fetchCategories().then((d) => setCategories(d.categories || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { showToast('Please log in to report an issue.', 'warning'); return; }
    if (!position) { showToast('Please click on the map to pinpoint the location.', 'warning'); return; }
    if (!categoryId) { showToast('Please select a category.', 'warning'); return; }
    if (!zoneId) { showToast('Please select a zone.', 'warning'); return; }

    setIsSubmitting(true);
    try {
      await createTicket({
        title,
        description,
        latitude: position.lat,
        longitude: position.lng,
        category_id: parseInt(categoryId, 10),
        zone_id: parseInt(zoneId, 10),
        priority,
      });
      showToast('Issue reported successfully!', 'success');
      setTitle(''); setDescription(''); setPosition(null); setCategoryId(''); setZoneId(''); setPriority('MEDIUM');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center animate-fade-in-up">
        <div className="ui-card bg-white p-10">
          <span className="text-5xl block mb-4">🔐</span>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-slate-500 text-sm mb-6">
            Please log in as a Citizen to report an issue.<br/>
            <span className="text-blue-600 font-medium mt-2 block">Recruiters: Use the Demo Credentials on the login page to access the portal.</span>
          </p>
          <Link to="/login" className="inline-block px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all hover:scale-[1.02]">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const selectClass = "w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer";
  const inputClass = "w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-fade-in-up">
      <div className="ui-card bg-white p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>📝</span> Report an Issue
          </h2>
          <p className="text-slate-500 text-sm mt-1">Help us improve the city by pinpointing infrastructure problems.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Issue Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Large Pothole on Main St" className={inputClass} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} placeholder="Provide specific details about the issue..." className={`${inputClass} resize-none`} />
          </div>

          {/* Category & Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={selectClass}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Zone</label>
              <select value={zoneId} onChange={(e) => setZoneId(e.target.value)} className={selectClass}>
                <option value="">Select zone</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>{z.zone_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <div className="flex flex-wrap gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    priority === p.value
                      ? `${p.bg} ${p.text} ${p.border} ring-1 ring-current scale-105 shadow-sm`
                      : 'border-slate-300 text-slate-600 hover:border-slate-400 bg-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5 flex justify-between items-center">
              <span>📍 Location Pin</span>
              {position && (
                <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
                  {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                </span>
              )}
            </label>
            <div className="h-[320px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm z-0">
              <MapContainer center={cityCenter} zoom={13} className="h-full w-full">
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                />
                <LocationPicker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all hover:scale-[1.02] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin-ring 0.6s linear infinite' }} />
                Submitting...
              </span>
            ) : (
              'Submit Report'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}