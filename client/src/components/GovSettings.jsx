import { useState, useEffect } from 'react';
import { User, Bell, Shield, Key, Save, Image as ImageIcon, Sparkles, MapPin, Check, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function GovSettings() {
  const { user, updateProfile, logout } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.full_name || 'Alexander Sterling',
    email: user?.email || 'alexander.sterling@civicelite.org',
    phone: user?.phone || '+1 (555) 234-5678',
    zone: user?.zone || 'Zone 4 - Downtown Commercial Core',
    session_expiry: user?.session_expiry || '30 Days (Recommended)',
    notifications: {
      emailAlerts: true,
      smsDispatch: true,
      slaReminders: true,
      marketing: false,
    },
    privacy: {
      shareFullProfile: true,
      displayActivityFeed: true,
    }
  });

  useEffect(() => {
    if (user) {
      let notifs = { emailAlerts: true, smsDispatch: true, slaReminders: true, marketing: false };
      if (user.notifications) {
        try {
          notifs = typeof user.notifications === 'string' ? JSON.parse(user.notifications) : user.notifications;
        } catch (e) {}
      }
      setProfileData(prev => ({
        ...prev,
        name: user.full_name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        zone: user.zone || prev.zone,
        session_expiry: user.session_expiry || prev.session_expiry,
        notifications: notifs
      }));
    }
  }, [user]);

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!updateProfile) return;
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        zone: profileData.zone,
        notifications: profileData.notifications,
        session_expiry: profileData.session_expiry
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRevoke = () => {
    if (window.confirm("Are you sure you want to revoke your account access and log out?")) {
      if (logout) logout();
    }
  };

  return (
    <div className="lg:col-span-9 xl:col-span-10 h-full overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Citizen Preferences & Security</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Personal Settings & Authentication</h1>
            <p className="text-slate-100 text-sm max-w-2xl leading-relaxed">
              Manage your verified civic identity, adjust automated notification thresholds, and configure your default municipal dispatch zone.
            </p>
          </div>

          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 hover:bg-slate-50 font-bold text-sm rounded-2xl transition-all shadow-lg active:scale-95 whitespace-nowrap disabled:opacity-50">
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4 text-blue-600" />}
            <span>{isSaving ? 'Saving...' : isSaved ? 'Settings Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Profile Form & Notification Toggles */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8">
          {/* Section 1: Profile Avatar & Basics */}
          <div>
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-900">Civic Profile Identity</h3>
              <p className="text-xs text-slate-500 mt-0.5">Verified details attached to your municipal complaints</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className="relative group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  alt="Profile Avatar"
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-md group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-slate-900/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                  <ImageIcon className="w-4 h-4" />
                  <span>Change</span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Citizen Elite Verification Active</h4>
                <p className="text-xs text-slate-500 mb-3 max-w-md leading-relaxed">
                  Uploaded avatars must be at least 300x300px in JPG or PNG format. Your verified status badge will appear alongside your picture.
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95">
                    Upload New Photo
                  </button>
                  <button className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Citizen Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Registered Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mobile Contact Number</label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Default Municipal Zone</label>
                <select
                  value={profileData.zone}
                  onChange={(e) => setProfileData({...profileData, zone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                >
                  <option>Zone 1 - North Hills</option>
                  <option>Zone 2 - Westside Industrial</option>
                  <option>Zone 4 - Downtown Commercial Core</option>
                  <option>Zone 8 - East Waterfront</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Notifications */}
          <div>
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-900">Notification Thresholds</h3>
              <p className="text-xs text-slate-500 mt-0.5">Automated dispatch alerts & SLA tracking reminders</p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'emailAlerts', title: 'Instant Email Dispatches', desc: 'Receive real-time automated updates whenever an assigned field crew updates your ticket status.' },
                { id: 'smsDispatch', title: 'SMS Triage Notifications', desc: 'Get immediate text messages for Critical Priority hazard classifications and live GPS crew arrivals.' },
                { id: 'slaReminders', title: 'SLA Breach Safeguard Alerts', desc: 'Receive automated escrow notifications if an assigned municipal department breaches its designated resolution timeframe.' },
                { id: 'marketing', title: 'Community Engagement Broadcasts', desc: 'Subscribe to monthly civic newsletters and new policy enactment summaries.' },
              ].map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfileData({
                      ...profileData,
                      notifications: { ...profileData.notifications, [item.id]: !profileData.notifications[item.id] }
                    })}
                    className={`w-12 h-6 rounded-full transition-colors relative p-1 flex-shrink-0 shadow-inner ${
                      profileData.notifications[item.id] ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`w-4 h-4 bg-white rounded-full block transition-transform shadow-md ${
                      profileData.notifications[item.id] ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Security & Authentication */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-900">Two-Factor Security</h3>
              <p className="text-xs text-slate-500 mt-0.5">Hardened login authentication</p>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-4 items-start">
                <div className="p-3 bg-emerald-500 text-white rounded-2xl flex-shrink-0 shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">2FA Fully Active</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your account is securely fortified with biometrical app authentication and SMS fallback keys.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Session Expiry</label>
                <select
                  value={profileData.session_expiry}
                  onChange={(e) => setProfileData({...profileData, session_expiry: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                >
                  <option>30 Days (Recommended)</option>
                  <option>7 Days</option>
                  <option>24 Hours</option>
                  <option>Logout on browser close</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Active Access Tokens</h4>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">Chrome Windows 11</p>
                    <p className="text-slate-400 text-[10px]">Active now • IP: 192.168.1.1</p>
                  </div>
                  <span className="text-emerald-600 font-bold">Current</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-rose-500/20 rounded-full blur-xl pointer-events-none" />
            <h4 className="text-base font-bold mb-1">Danger Zone</h4>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">Permanently revoke your civic profile and erase all audit logs from municipal nodes.</p>
            <button onClick={handleRevoke} className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95">
              Revoke Account Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
