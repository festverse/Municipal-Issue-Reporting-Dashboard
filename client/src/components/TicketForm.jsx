import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createTicket, fetchZones, fetchCategories, analyzeIssueAI } from '../api/client';
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);
  const [zones, setZones] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [urgentThreat, setUrgentThreat] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

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
        description: isAnonymous ? `${description}\n\n(Filed Anonymously)` : description,
        latitude: position.lat,
        longitude: position.lng,
        category_id: parseInt(categoryId, 10),
        zone_id: parseInt(zoneId, 10),
        priority,
      });
      showToast('Issue reported successfully!', 'success');
      setTitle(''); setDescription(''); setPosition(null); setCategoryId(''); setZoneId(''); setPriority('MEDIUM'); setAiInsight(null); setGpsEnabled(false); setUrgentThreat(false); setIsAnonymous(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreset = (preset) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setPriority(preset.priority);
    const matchedCat = categories.find(c => c.name.toLowerCase().includes(preset.catKeyword));
    if (matchedCat) setCategoryId(String(matchedCat.id));
    if (!zoneId && zones.length > 0) setZoneId(String(zones[0].id));
    if (!position) setPosition({ lat: 21.1702 + (Math.random() - 0.5) * 0.02, lng: 72.8311 + (Math.random() - 0.5) * 0.02 });
    showToast(`Loaded preset: ${preset.label}`, 'success');
  };

  const handleToggleGPS = () => {
    if (!gpsEnabled) {
      if (navigator.geolocation) {
        showToast('Acquiring high-precision GPS coordinates...', 'info');
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            setGpsEnabled(true);
            showToast('GPS coordinates acquired successfully!', 'success');
          },
          (err) => {
            showToast('GPS permission denied or unavailable. Using default map center.', 'warning');
            setGpsEnabled(false);
          }
        );
      } else {
        showToast('Geolocation is not supported by your browser.', 'error');
      }
    } else {
      setGpsEnabled(false);
      showToast('High-precision GPS disabled.', 'info');
    }
  };

  const handleToggleUrgent = () => {
    const nextVal = !urgentThreat;
    setUrgentThreat(nextVal);
    if (nextVal) {
      setPriority('CRITICAL');
      if (!description.includes('[URGENT SAFETY HAZARD]')) {
        setDescription(`[URGENT SAFETY HAZARD] ${description}`);
      }
      showToast('Escalated to Critical Public Safety Threat', 'warning');
    } else {
      setPriority('MEDIUM');
      setDescription(description.replace('[URGENT SAFETY HAZARD] ', ''));
      showToast('Urgent escalation removed', 'info');
    }
  };

  const handleToggleAnonymous = () => {
    const nextVal = !isAnonymous;
    setIsAnonymous(nextVal);
    showToast(nextVal ? 'Anonymous filing enabled. Your details will be masked.' : 'Anonymous filing disabled.', 'info');
  };

  const handleAIAssist = async () => {
    if (!title && !description) {
      showToast('Please enter a title or description first for AI analysis.', 'warning');
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await analyzeIssueAI(title, description);
      if (res && res.data) {
        setCategoryId(String(res.data.categoryId));
        setPriority(res.data.priority);
        setAiInsight(res.data);
        showToast('AI Smart Assist successfully evaluated the issue!', 'success');
      }
    } catch (err) {
      showToast('AI Analysis failed: ' + err.message, 'error');
    } finally {
      setIsAnalyzing(false);
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
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column — Feature-Rich Side Panel */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Card 1: Quick Civic Presets */}
          <div className="ui-card bg-white p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <span>⚡</span> Quick Civic Presets
            </h3>
            <p className="text-xs text-slate-500 mb-4">Instantly populate common municipal reports with AI-calibrated settings.</p>
            <div className="space-y-2">
              {[
                { label: 'Severe Pothole Hazard', title: 'Dangerous deep pothole causing traffic hazard', description: 'Large deep pothole in the middle of the active roadway. Poses immediate damage risk to vehicles and danger to cyclists.', priority: 'HIGH', catKeyword: 'road' },
                { label: 'Main Pipe Water Leak', title: 'Major clean water pipe burst flooding the street', description: 'Underground water main burst causing continuous clean water flooding across the road surface and draining pressure.', priority: 'CRITICAL', catKeyword: 'water' },
                { label: 'Streetlight Grid Outage', title: 'Complete block streetlight failure creating safety risk', description: 'Entire street block has lost street lighting. Area is completely dark after sunset, creating a significant pedestrian safety hazard.', priority: 'MEDIUM', catKeyword: 'electr' },
                { label: 'Fallen Tree Obstruction', title: 'Fallen tree blocking public pathway/roadway', description: 'Large mature tree has fallen across the public right-of-way, completely blocking pedestrian and vehicular access.', priority: 'HIGH', catKeyword: 'park' },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className="w-full text-left px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-200 transition-all flex items-center justify-between group active:scale-95"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{preset.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Priority: {preset.priority}</p>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-blue-600 transition-colors">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Report Settings & Overrides */}
          <div className="ui-card bg-white p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <span>🛠️</span> Report Options & Overrides
            </h3>
            <p className="text-xs text-slate-500 mb-4">Advanced filing controls and telemetry overrides.</p>
            <div className="space-y-4">
              
              {/* Toggle 1: GPS */}
              <button
                type="button"
                onClick={handleToggleGPS}
                className="w-full flex items-center justify-between text-left group"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800">High-Precision GPS</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Acquire exact HTML5 device telemetry</p>
                </div>
                <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${gpsEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${gpsEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </button>

              {/* Toggle 2: Urgent Threat */}
              <button
                type="button"
                onClick={handleToggleUrgent}
                className="w-full flex items-center justify-between text-left group"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800">Urgent Safety Escalation</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Flag as immediate public hazard</p>
                </div>
                <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${urgentThreat ? 'bg-rose-600' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${urgentThreat ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </button>

              {/* Toggle 3: Anonymous */}
              <button
                type="button"
                onClick={handleToggleAnonymous}
                className="w-full flex items-center justify-between text-left group"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800">Anonymous Filing</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Protect citizen identity publicly</p>
                </div>
                <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${isAnonymous ? 'bg-slate-800' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isAnonymous ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </button>

            </div>
          </div>

          {/* Card 3: AI Triage & SLA Guarantees */}
          <div className="ui-card bg-white p-5 border-t-4 border-blue-600">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <span>ℹ️</span> Dispatch & SLA Guarantee
            </h3>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              All reports are evaluated in real-time by the City AI Engine. Guaranteed municipal emergency dispatch resolution windows:
            </p>
            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-rose-700 font-bold">🔴 Critical Priority</span>
                <span className="text-slate-600">&lt; 24 Hours</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-amber-700 font-bold">🟡 High Priority</span>
                <span className="text-slate-600">&lt; 48 Hours</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-blue-700 font-bold">🔵 Medium Priority</span>
                <span className="text-slate-600">&lt; 5 Days</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-700 font-bold">⚪ Low Priority</span>
                <span className="text-slate-600">&lt; 7 Days</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column — Main Issue Report Form */}
        <div className="lg:col-span-2">
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
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <button
                    type="button"
                    onClick={handleAIAssist}
                    disabled={isAnalyzing}
                    className="flex items-center gap-1.5 px-3 py-1 bg-ai-gradient text-white font-semibold text-xs rounded-lg shadow-sm hover:opacity-95 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin-ring 0.6s linear infinite' }} />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <span>✨</span> AI Smart Assist
                      </>
                    )}
                  </button>
                </div>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} placeholder="Provide specific details about the issue..." className={`${inputClass} resize-none`} />
              </div>

              {/* AI Insight Card */}
              {aiInsight && (
                <div className="p-4 rounded-2xl bg-purple-50/80 border-ai animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-ai-gradient flex items-center gap-1">
                      <span>🤖</span> AI Triage Complete
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                      {aiInsight.confidence}% Confidence
                    </span>
                  </div>
                  <p className="text-xs text-purple-950 leading-relaxed font-medium">
                    {aiInsight.explanation}
                  </p>
                </div>
              )}

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
      </div>
    </div>
  );
}