import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ui/Toast';
import { Rocket, Shield, MessageSquare, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '', role: 'CITIZEN' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');

    setIsLoading(true);
    try {
      const data = await register({ full_name: form.full_name, email: form.email, password: form.password, role: form.role });
      showToast('Account created successfully!', 'success');
      if (data.user?.role === 'CITIZEN') {
        navigate('/');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { value: 'CITIZEN', label: 'Citizen', desc: 'Report & upvote issues' },
    { value: 'ENGINEER', label: 'Engineer', desc: 'Manage & resolve tickets' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      
      {/* Left Column — Immersive Civic Showcase (Panchayat.me inspired) */}
      <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200 mb-8 shadow-inner animate-fade-in">
            <Rocket className="w-4 h-4 text-blue-300" />
            <span>Join the Civic Revolution</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 animate-fade-in-up">
            Empowering communities with <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">real-time accountability.</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-12 max-w-xl animate-fade-in-up">
            Whether you are a citizen reporting local infrastructure hazards or a municipal engineer managing urgent dispatch SLAs, Civic Portal gives you the elite tools to make an immediate impact.
          </p>
        </div>

        {/* Gorgeous Feature Showcase Card */}
        <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6 animate-fade-in mb-8 lg:mb-0">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center shadow-lg text-white font-bold text-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Community Verification</h4>
                <p className="text-xs text-slate-300">Open Governance Telemetry</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Secured
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xl font-extrabold text-blue-300">100%</p>
              <p className="text-[11px] text-slate-300 font-medium mt-1">Transparent</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xl font-extrabold text-violet-300 flex items-center justify-center gap-1">
                <MessageSquare className="w-5 h-5 text-violet-300" />
                <span>Feed</span>
              </p>
              <p className="text-[11px] text-slate-300 font-medium mt-1">Civic Discussions</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xl font-extrabold text-emerald-300 flex items-center justify-center gap-1">
                <Clock className="w-5 h-5 text-emerald-300" />
                <span>SLA</span>
              </p>
              <p className="text-[11px] text-slate-300 font-medium mt-1">Protected Rights</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-6 mt-auto">
          <span>© Civic Portal Enterprise</span>
          <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-slate-400" /> End-to-end Verified</span>
        </div>
      </div>

      {/* Right Column — Pristine White Form Container */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md animate-fade-in-up">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 text-sm mt-1.5">Join the civic platform community to start reporting & resolving.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl animate-fade-in flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <p className="text-rose-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.full_name}
                onChange={update('full_name')}
                required
                placeholder="Jane Doe"
                className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={update('password')}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm</label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={update('confirm')}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-3.5 rounded-2xl border text-left transition-all active:scale-95 ${
                      form.role === r.value
                        ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className={`text-sm font-bold ${form.role === r.value ? 'text-blue-700' : 'text-slate-700'}`}>{r.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" style={{ animation: 'spin-ring 0.6s linear infinite' }} />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition-colors underline underline-offset-4">
              Sign in to Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
