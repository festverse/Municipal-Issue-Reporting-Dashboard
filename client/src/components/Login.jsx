import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ui/Toast';
import { Sparkles, Landmark, Zap, Map, ShieldCheck, Rocket, Wrench, User, AlertTriangle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      showToast('Welcome back!', 'success');
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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      
      {/* Left Column — Immersive Civic Showcase (Panchayat.me inspired) */}
      <div className="lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200 mb-8 shadow-inner animate-fade-in">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span>Next-Generation Civic Engagement Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 animate-fade-in-up">
            Transform local governance through <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">collective action.</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-12 max-w-xl animate-fade-in-up">
            Empowering citizens to report, track, and resolve everyday infrastructure issues in real-time. Join the municipal revolution driven by open data and AI triage.
          </p>
        </div>

        {/* Gorgeous Feature Showcase Card */}
        <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl space-y-6 animate-fade-in mb-8 lg:mb-0">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center shadow-lg text-white font-bold text-lg">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Smart City Command</h4>
                <p className="text-xs text-slate-300">Live Municipal Telemetry</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xl font-extrabold text-blue-300">99.4%</p>
              <p className="text-[11px] text-slate-300 font-medium mt-1">SLA Compliance</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xl font-extrabold text-violet-300 flex items-center justify-center gap-1">
                <Zap className="w-5 h-5 text-violet-300" />
                <span>AI</span>
              </p>
              <p className="text-[11px] text-slate-300 font-medium mt-1">Smart Triage</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-xl font-extrabold text-emerald-300 flex items-center justify-center gap-1">
                <Map className="w-5 h-5 text-emerald-300" />
                <span>Live</span>
              </p>
              <p className="text-[11px] text-slate-300 font-medium mt-1">Heatmaps</p>
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
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 text-sm mt-1.5">Sign in to access your civic dashboard and community feeds.</p>
          </div>

          {/* Demo Credentials for Recruiters */}
          <div className="mb-8 p-5 bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/80 rounded-2xl shadow-sm">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Rocket className="w-4 h-4 text-blue-600" />
              <span>Recruiter Demo Accounts</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button 
                type="button" 
                onClick={() => { setEmail('engineer@demo.com'); setPassword('engineer123'); }}
                className="py-2.5 px-3 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Wrench className="w-4 h-4 text-slate-600" />
                <span>Fill Engineer Data</span>
              </button>
              <button 
                type="button" 
                onClick={() => { setEmail('citizen@demo.com'); setPassword('citizen123'); }}
                className="py-2.5 px-3 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span>Fill Citizen Data</span>
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl animate-fade-in flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <p className="text-rose-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
                />
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
                  Signing in...
                </span>
              ) : (
                'Sign In to Portal'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors underline underline-offset-4">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}