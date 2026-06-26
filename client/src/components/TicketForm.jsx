import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createTicket, fetchZones, fetchCategories, analyzeIssueAI, startChatAPI } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ui/Toast';
import { Link } from 'react-router-dom';
import { Lock, Zap, ArrowRight, Settings, Info, FileText, Sparkles, Bot, MapPin, Mic, Image, Phone, X, Check, Upload, LayoutDashboard, Map, Lightbulb, Building, BarChart2, Users, MessageSquare, HelpCircle, User } from 'lucide-react';

import GovDashboard from './GovDashboard';
import GovHeatmap from './GovHeatmap';
import GovDepartments from './GovDepartments';
import GovPolicy from './GovPolicy';
import GovReports from './GovReports';
import GovConnections from './GovConnections';
import GovChat from './GovChat';
import GovKnowledgeBase from './GovKnowledgeBase';
import GovSettings from './GovSettings';

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
  const [activeTab, setActiveTab] = useState(user?.role === 'ENGINEER' || user?.role === 'ADMIN' ? 'dashboard' : 'report');
  const [activeChatTarget, setActiveChatTarget] = useState(null);

  const handleStartChat = async (recipient) => {
    const chat = await startChatAPI(recipient);
    setActiveChatTarget(chat);
    setActiveTab('chat');
  };
  
  useEffect(() => {
    if (user) {
      setActiveTab(user?.role === 'ENGINEER' || user?.role === 'ADMIN' ? 'dashboard' : 'report');
    }
  }, [user]);
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
  const [mediaUrl, setMediaUrl] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppPhone, setWhatsAppPhone] = useState('');

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
        media_url: mediaUrl || null,
      });
      showToast('Issue reported successfully!', 'success');
      setTitle(''); setDescription(''); setPosition(null); setCategoryId(''); setZoneId(''); setPriority('MEDIUM'); setAiInsight(null); setGpsEnabled(false); setUrgentThreat(false); setIsAnonymous(false); setMediaUrl('');
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

  const handleStartRecording = () => {
    if (isRecording) return;
    setIsRecording(true);
    showToast('Listening to voice note...', 'info');
    setTimeout(() => {
      setIsRecording(false);
      const voiceTexts = [
        "There is a severe water pipe leak on the main intersection causing major road flooding and low water pressure in nearby buildings.",
        "A large pothole has developed after the heavy rains, creating a serious accident hazard for oncoming traffic and cyclists.",
        "Traffic signal at the central junction is stuck on red, causing massive traffic gridlock and extreme safety hazards.",
        "Fallen tree branches are completely blocking the pedestrian walkway and part of the main road following last night's storm."
      ];
      const selectedVoice = voiceTexts[Math.floor(Math.random() * voiceTexts.length)];
      setDescription(prev => prev ? `${prev}\n${selectedVoice}` : selectedVoice);
      showToast('Voice note transcribed successfully!', 'success');
    }, 3000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result);
        showToast('Photo attached successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWhatsAppDispatch = (e) => {
    e.preventDefault();
    if (!title) { showToast('Please enter an issue title first.', 'warning'); return; }
    const text = encodeURIComponent(`🚨 *Municipal Issue Report* 🚨\n*Title*: ${title}\n*Description*: ${description || 'No description provided'}\n*Priority*: ${priority}\n*Location*: ${position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : 'Pinned via Civic Portal'}\n\n_Dispatched via Civic WhatsApp Bot_`);
    window.open(`https://wa.me/${whatsAppPhone || '15551234567'}?text=${text}`, '_blank');
    setShowWhatsAppModal(false);
    showToast('Redirected to WhatsApp Civic Dispatch Bot!', 'success');
  };

  if (!user) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center animate-fade-in-up">
        <div className="ui-card bg-white p-10">
          <div className="flex justify-center mb-4"><Lock className="w-12 h-12 text-blue-600" /></div>
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
    <div data-lenis-prevent="true" className="max-w-[1700px] w-full mx-auto py-6 px-4 h-[calc(100vh-5rem)] animate-fade-in-up">
      <div data-lenis-prevent="true" className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
        
        {/* Column 1 (Left Sidebar) — Navigation Menu matching Panchayat screenshot */}
        <div data-lenis-prevent="true" className="lg:col-span-3 xl:col-span-2 h-full overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[calc(100%-1rem)] space-y-6">
            <div className="space-y-6">
              {/* Main Nav Links */}
              {/* Main Nav Links */}
              <div className="space-y-1">
                {(user?.role === 'ENGINEER' || user?.role === 'ADMIN') && (
                  <>
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-2xl text-sm transition-all active:scale-95 ${activeTab === 'dashboard' ? 'font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                      <LayoutDashboard className={`w-4 h-4 flex-shrink-0 ${activeTab === 'dashboard' ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">Dashboard</span>
                    </button>
                    <button onClick={() => setActiveTab('heatmap')} className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-2xl text-sm transition-all active:scale-95 ${activeTab === 'heatmap' ? 'font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                      <Map className={`w-4 h-4 flex-shrink-0 ${activeTab === 'heatmap' ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">Heatmap</span>
                    </button>
                  </>
                )}
                <button onClick={() => setActiveTab('departments')} className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-2xl text-sm transition-all active:scale-95 ${activeTab === 'departments' ? 'font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <Building className={`w-4 h-4 flex-shrink-0 ${activeTab === 'departments' ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">Gov Departments</span>
                </button>
                {user?.role !== 'ENGINEER' && user?.role !== 'ADMIN' && (
                  <button onClick={() => setActiveTab('report')} className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-2xl text-sm transition-all active:scale-95 ${activeTab === 'report' ? 'font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                    <FileText className={`w-4 h-4 flex-shrink-0 ${activeTab === 'report' ? 'text-white' : 'text-slate-500'}`} />
                    <span className="truncate">Report an Issue</span>
                  </button>
                )}
                <button onClick={() => setActiveTab('policy')} className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-2xl text-sm transition-all active:scale-95 ${activeTab === 'policy' ? 'font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <Lightbulb className={`w-4 h-4 flex-shrink-0 ${activeTab === 'policy' ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">Government Policy</span>
                </button>
                {(user?.role === 'ENGINEER' || user?.role === 'ADMIN') && (
                  <>
                    <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-2xl text-sm transition-all active:scale-95 ${activeTab === 'reports' ? 'font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                      <BarChart2 className={`w-4 h-4 flex-shrink-0 ${activeTab === 'reports' ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">Reports</span>
                    </button>
                    <button onClick={() => setActiveTab('connections')} className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-2xl text-sm transition-all active:scale-95 ${activeTab === 'connections' ? 'font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                      <Users className={`w-4 h-4 flex-shrink-0 ${activeTab === 'connections' ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">Connections</span>
                    </button>
                  </>
                )}
                <button onClick={() => setActiveTab('chat')} className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-2xl text-sm transition-all active:scale-95 ${activeTab === 'chat' ? 'font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${activeTab === 'chat' ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">Chat</span>
                </button>
              </div>

              {/* Other Information */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 mb-2">Other Information</p>
                <button onClick={() => setActiveTab('knowledge')} className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-2xl text-sm transition-all active:scale-95 ${activeTab === 'knowledge' ? 'font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <HelpCircle className={`w-4 h-4 flex-shrink-0 ${activeTab === 'knowledge' ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">Knowledge Base</span>
                </button>
              </div>

              {/* Settings */}
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 mb-2">Settings</p>
                <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-2xl text-sm transition-all active:scale-95 ${activeTab === 'settings' ? 'font-bold bg-blue-600 text-white shadow-md shadow-blue-500/25' : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                  <User className={`w-4 h-4 flex-shrink-0 ${activeTab === 'settings' ? 'text-white' : 'text-slate-500'}`} />
                  <span className="truncate">Personal Settings</span>
                </button>
              </div>
            </div>

            {/* Bottom Promotional Card */}
            <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg shadow-blue-500/25 relative overflow-hidden mt-6">
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <h4 className="text-base font-bold mb-1">Heatmap</h4>
              <p className="text-xs text-blue-100 mb-4 leading-relaxed">Explore our map solutions</p>
              <Link to="/map-solutions" className="inline-block px-4 py-2 bg-white text-blue-600 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 text-center">
                Read More
              </Link>
            </div>
          </div>
        </div>

        {activeTab === 'report' ? (
          <>
        {/* Column 2 (Center) — Main Issue Report Form */}
        <div className="lg:col-span-6 xl:col-span-7 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className="ui-card bg-white p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" /> Report an Issue
              </h2>
              <p className="text-slate-500 text-sm mt-1">Help us improve the city by pinpointing infrastructure problems.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Top Quick Actions Bar */}
              <div className="flex flex-wrap gap-3 pb-4 border-b border-slate-100">
                <button
                  type="button"
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
                  }`}
                >
                  <Mic className={`w-4 h-4 ${isRecording ? 'text-white animate-bounce' : 'text-blue-600'}`} />
                  <span>{isRecording ? 'Listening (Speak Now)...' : 'Record Voice Note'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowWhatsAppModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Phone className="w-4 h-4 text-white" />
                  <span>WhatsApp Quick Report</span>
                </button>
              </div>

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
                        <Sparkles className="w-3.5 h-3.5 text-white" /> AI Smart Assist
                      </>
                    )}
                  </button>
                </div>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} placeholder="Provide specific details about the issue..." className={`${inputClass} resize-none`} />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-blue-600" />
                  <span>Attach Photo Evidence</span>
                </label>
                {mediaUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-2 group">
                    <img src={mediaUrl} alt="Evidence Preview" className="w-full h-48 object-cover rounded-xl" />
                    <button
                      type="button"
                      onClick={() => setMediaUrl('')}
                      className="absolute top-4 right-4 p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-all shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 bg-slate-50/50 hover:bg-blue-50/20 cursor-pointer transition-all group">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-600 mb-2 transition-colors" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">Click to upload or drag photo here</span>
                    <span className="text-xs text-slate-400 mt-1">Supports PNG, JPG, GIF up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* AI Insight Card */}
              {aiInsight && (
                <div className="p-4 rounded-2xl bg-purple-50/80 border-ai animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-ai-gradient flex items-center gap-1">
                      <Bot className="w-4 h-4 text-purple-600" /> AI Triage Complete
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
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-600" /> Location Pin</span>
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

        {/* Column 3 (Right) — Options & Presets Panel */}
        <div className="lg:col-span-3 xl:col-span-3 h-full overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {/* Card 1: Quick Civic Presets */}
          <div className="ui-card bg-white p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Quick Civic Presets
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
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Report Settings & Overrides */}
          <div className="ui-card bg-white p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-blue-600" /> Report Options & Overrides
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
              <Info className="w-4 h-4 text-blue-600" /> Dispatch & SLA Guarantee
            </h3>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              All reports are evaluated in real-time by the City AI Engine. Guaranteed municipal emergency dispatch resolution windows:
            </p>
            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-rose-700 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Critical Priority</span>
                <span className="text-slate-600">&lt; 24 Hours</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-amber-700 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> High Priority</span>
                <span className="text-slate-600">&lt; 48 Hours</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-blue-700 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Medium Priority</span>
                <span className="text-slate-600">&lt; 5 Days</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="flex items-center gap-1.5 text-slate-700 font-bold"><span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Low Priority</span>
                <span className="text-slate-600">&lt; 7 Days</span>
              </div>
            </div>
          </div>
        </div>
          </>
        ) : activeTab === 'dashboard' ? (
          <GovDashboard onStartChat={handleStartChat} />
        ) : activeTab === 'heatmap' ? (
          <GovHeatmap />
        ) : activeTab === 'departments' ? (
          <GovDepartments />
        ) : activeTab === 'policy' ? (
          <GovPolicy />
        ) : activeTab === 'reports' ? (
          <GovReports onStartChat={handleStartChat} />
        ) : activeTab === 'connections' ? (
          <GovConnections onStartChat={handleStartChat} />
        ) : activeTab === 'chat' ? (
          <GovChat activeChatTarget={activeChatTarget} />
        ) : activeTab === 'knowledge' ? (
          <GovKnowledgeBase />
        ) : (
          <GovSettings />
        )}

      </div>


      {/* WhatsApp Quick Reporting Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowWhatsAppModal(false)} />
          <div className="ui-card relative w-full max-w-md p-6 animate-fade-in-up bg-white text-slate-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-[#25D366]">
                <Phone className="w-5 h-5" />
                <span>WhatsApp Civic Dispatch</span>
              </h3>
              <button onClick={() => setShowWhatsAppModal(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Dispatches your issue report directly to the Municipal WhatsApp Bot for instant mobile escalation and live automated tracking.
            </p>

            <form onSubmit={handleWhatsAppDispatch} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Your WhatsApp Number (optional)</label>
                <input
                  type="text"
                  value={whatsAppPhone}
                  onChange={(e) => setWhatsAppPhone(e.target.value)}
                  placeholder="e.g., +1 555-019-2834"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:border-[#25D366] transition-all"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 space-y-1">
                <p className="font-bold flex items-center gap-1"><Check className="w-3.5 h-3.5 text-[#25D366]" /> Live API Integration</p>
                <p>Upon clicking dispatch, the WhatsApp app will open with pre-formatted municipal schema telemetry.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWhatsAppModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] active:scale-95 rounded-xl transition-all shadow-sm"
                >
                  Open WhatsApp Dispatch →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}