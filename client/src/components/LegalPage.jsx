import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Shield, FileText, UserCheck, Clock, Lock, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

const tabs = [
  { id: 'privacy', label: 'Privacy Policy', icon: Shield, desc: 'How we manage and protect citizen data' },
  { id: 'terms', label: 'Terms of Service', icon: FileText, desc: 'Rules and guidelines for portal usage' },
  { id: 'charter', label: 'Citizen Rights Charter', icon: UserCheck, desc: 'Your public rights and municipal entitlement' },
  { id: 'sla', label: 'SLA Undertaking', icon: Clock, desc: 'Guaranteed municipal resolution windows' },
  { id: 'security', label: 'Security Disclosures', icon: Lock, desc: 'Enterprise encryption and vulnerability reporting' },
];

export default function LegalPage() {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(policyId || 'privacy');

  useEffect(() => {
    if (policyId && tabs.some((t) => t.id === policyId)) {
      setActiveTab(policyId);
    }
  }, [policyId]);

  const handleTabChange = (id) => {
    setActiveTab(id);
    navigate(`/legal/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 animate-fade-in">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200 mb-6 shadow-inner">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span>Official Legal & Governance Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Legal & Municipal Governance
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            Excellence in smart city governance requires absolute transparency, enforced service level agreements, and ironclad data privacy.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-3 sticky top-24">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">Governance Documents</h3>
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTabChange(t.id)}
                    className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-4 ${
                      isActive
                        ? 'bg-blue-50 border border-blue-200 shadow-sm text-blue-900 ring-1 ring-blue-500/20'
                        : 'bg-white border border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isActive ? 'text-blue-700' : 'text-slate-900'}`}>{t.label}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-2/3">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-sm min-h-[600px]">
              
              {activeTab === 'privacy' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-slate-200 pb-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h2>
                    <p className="text-slate-500 text-sm">Last updated: June 2026 • Effective immediately across all municipal districts</p>
                  </div>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">1. Information We Collect</h3>
                    <p className="text-slate-600 leading-relaxed">
                      We collect information necessary to accurately route and resolve municipal infrastructure issues. This includes user-provided details (name, email, phone number) and automated telemetry (HTML5 exact GPS geolocation, device timestamps, and submitted media files).
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">2. Geolocation & Telemetry Masking</h3>
                    <p className="text-slate-600 leading-relaxed">
                      When you submit an issue, your exact latitude and longitude are logged for municipal engineering crews. If you select "Anonymous Filing," your public profile is completely masked on the community feed while retaining precise coordinates solely for internal dispatch.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">3. AI Processing & Third-Party Sharing</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Our platform implements heuristic AI triage to scan text for emergency keywords. We do not sell, rent, or trade personal data to commercial advertisers. Data is shared exclusively with certified municipal departments, public works supervisors, and official first responders.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">4. Data Retention & Deletion</h3>
                    <p className="text-slate-600 leading-relaxed">
                      All citizen accounts retain the statutory right to request full account purging. Archived tickets and resolved infrastructure logs are anonymized and retained in the public municipal register for civic accountability and historical trend analysis.
                    </p>
                  </section>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-slate-200 pb-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h2>
                    <p className="text-slate-500 text-sm">Legally binding terms between portal users and Municipal Operations</p>
                  </div>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h3>
                    <p className="text-slate-600 leading-relaxed">
                      By accessing, browsing, or submitting reports to the Civic Portal, you agree to comply with and be bound by these Terms of Service. These terms apply to all visitors, active citizens, municipal engineers, and administrative personnel.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">2. Code of Conduct & Valid Reporting</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Users agree to submit accurate, genuine, and verified municipal issues. Spamming, submitting false hazard alarms, or uploading explicit/harmful content is strictly prohibited and will result in immediate permanent suspension of portal access.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">3. Municipal Authority Disclaimers</h3>
                    <p className="text-slate-600 leading-relaxed">
                      While the portal enforces strict Service Level Agreements (SLAs), emergency resolution times may vary during extreme weather events, public emergencies, or natural disasters. The portal is not a direct substitute for emergency services (such as 911).
                    </p>
                  </section>
                </div>
              )}

              {activeTab === 'charter' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-slate-200 pb-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Citizen Rights Charter</h2>
                    <p className="text-slate-500 text-sm">Your constitutional entitlement to clean, functional, and safe public spaces</p>
                  </div>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">1. Fundamental Entitlements</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Every resident and citizen possesses the fundamental entitlement to safe transit roads, functioning street illumination, hygienic waste management, and prompt civil maintenance.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">2. Transparent Communication</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Citizens have the right to receive real-time, untempered status updates on their submitted issues. Every state transition (Open → Assigned → In Progress → Resolved) must be publicly timestamped and auditable.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">3. Right to Community Escalation</h3>
                    <p className="text-slate-600 leading-relaxed">
                      If a municipal issue gathers significant public support via "Affects me too" upvotes, it automatically triggers an executive review by the District Director of Public Works.
                    </p>
                  </section>
                </div>
              )}

              {activeTab === 'sla' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-slate-200 pb-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">SLA Undertaking</h2>
                    <p className="text-slate-500 text-sm">Guaranteed resolution windows and official municipal dispatch deadlines</p>
                  </div>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">1. Priority Tier Benchmarks</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Our platform incorporates statutory Service Level Agreements that bind engineering crews to specific maximum response windows:
                    </p>
                    <div className="space-y-3 pt-2">
                      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-rose-900">Critical Priority (Sewage Overflow, Exposed Live Wires)</h4>
                          <p className="text-xs text-rose-700">Immediate dispatch & emergency containment</p>
                        </div>
                        <span className="px-3 py-1 bg-rose-200 text-rose-800 font-bold text-xs rounded-xl">2 Hours</span>
                      </div>
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-amber-900">High Priority (Main Road Potholes, Total Streetlight Outage)</h4>
                          <p className="text-xs text-amber-700">Rapid investigation and active site work</p>
                        </div>
                        <span className="px-3 py-1 bg-amber-200 text-amber-800 font-bold text-xs rounded-xl">24 Hours</span>
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-blue-900">Medium & Low Priority (General Garbage, Minor Debris)</h4>
                          <p className="text-xs text-blue-700">Scheduled maintenance routine</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-200 text-blue-800 font-bold text-xs rounded-xl">48–72 Hours</span>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">2. Breach Protocol</h3>
                    <p className="text-slate-600 leading-relaxed">
                      In the event of an SLA breach, the ticket is visually flagged in crimson across the Executive Analytics dashboard and automated text alerts are routed directly to the Chief Municipal Engineer.
                    </p>
                  </section>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="border-b border-slate-200 pb-6">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Security Disclosures</h2>
                    <p className="text-slate-500 text-sm">Enterprise security architecture and responsible vulnerability disclosure</p>
                  </div>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">1. Infrastructure Encryption</h3>
                    <p className="text-slate-600 leading-relaxed">
                      All data in transit is secured via TLS 1.3 enterprise encryption. REST API communications between citizen web clients and municipal command servers utilize highly secure cryptographic tokens.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">2. Role-Based Access Control (RBAC)</h3>
                    <p className="text-slate-600 leading-relaxed">
                      System boundaries strictly isolate CITIZEN, ENGINEER, and ADMIN roles. Municipal updates and status transitions can only be executed by cryptographically authenticated public works engineers.
                    </p>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">3. Responsible Bug Bounty & Disclosure</h3>
                    <p className="text-slate-600 leading-relaxed">
                      We actively welcome cybersecurity researchers to inspect our platform. If you discover a potential vulnerability, please report it immediately to <span className="font-mono bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded">security@civicportal.gov</span>. We commit to acknowledging all reports within 24 hours.
                    </p>
                  </section>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Official Verified Policy
                </span>
                <span>Document Version 4.2.1 • Certified by Municipal Counsel</span>
              </div>

              <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-3xl text-xs text-slate-600 space-y-2 shadow-sm">
                <h4 className="font-bold text-slate-900">Academic & Portfolio Evaluation Notice</h4>
                <p className="leading-relaxed">
                  Copyright © 2026 <span className="font-bold text-blue-600">Utsav Vasava</span>. All rights reserved. This application and its full source code are published solely for evaluation by prospective employers, hiring managers, and clients. No license is granted to any entity to copy, download, modify, distribute, or commercialize this design or source code without explicit written permission from Utsav Vasava.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
