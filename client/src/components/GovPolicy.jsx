import { useState } from 'react';
import { Building, FileText, Download, Search, ExternalLink, Sparkles, Shield, AlertCircle, Bookmark } from 'lucide-react';

export default function GovPolicy() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const policies = [
    { id: 1, title: 'Municipal Smart Infrastructure Framework 2026', category: 'Infrastructure', code: 'POL-2026-INFRA', status: 'Enacted', date: 'Effective June 1, 2026', image: 'https://picsum.photos/id/1029/600/400', desc: 'Sets mandatory IoT sensor inclusion and automated AI dispatch response standards for all new road, lighting, and drainage developments within city limits.' },
    { id: 2, title: 'Rapid Transit & Arterial Pothole SLA Enforcement', category: 'Transportation', code: 'POL-2026-TRANS', status: 'Active Mandate', date: 'Effective May 15, 2026', image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80', desc: 'Establishes a legally binding 24-hour repair mandate for all citizen-reported potholes located on arterial transit corridors and commercial emergency routes.' },
    { id: 3, title: 'Clean Water Act & Deep Well Sanitization Decree', category: 'Sanitation', code: 'POL-2026-SANIT', status: 'In Review', date: 'Effective April 10, 2026', image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80', desc: 'Governs quarterly municipal water purity testing, mandatory real-time telemetry publication, and immediate public alert protocols for pipeline contaminants.' },
    { id: 4, title: 'Urban Electrification & Solar Microgrid Subsidies', category: 'Energy', code: 'POL-2026-ENRG', status: 'Enacted', date: 'Effective Jan 1, 2026', image: 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=600&q=80', desc: 'Mandates full transition of municipal streetlights to high-efficiency LED microgrids with automatic citizen portal integration for dark zone reporting.' },
  ];

  const categories = ['ALL', 'Infrastructure', 'Transportation', 'Sanitation', 'Energy'];

  const filteredPolicies = policies.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'ALL' || p.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="lg:col-span-9 xl:col-span-10 w-full space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Public Civic Legal Framework</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Municipal Government Policy & Mandates</h1>
            <p className="text-slate-100 text-sm max-w-2xl leading-relaxed">
              Examine the legally binding decrees, service level agreements (SLAs), and statutory guarantees that govern all municipal repairs and automated civic dispatches.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat ? 'bg-white text-blue-600 shadow-md' : 'text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Policies List */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Enacted Municipal Statutes</h3>
              <p className="text-xs text-slate-500 mt-0.5">Showing verified policies backed by statutory law</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search policies by keyword or code..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {filteredPolicies.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">No policies found</h4>
              <p className="text-xs text-slate-500">Try adjusting your search filters or category selection.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPolicies.map((pol) => (
                <div key={pol.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start">
                  <img src={pol.image} alt={pol.title} className="w-full sm:w-40 h-40 rounded-xl object-cover border border-slate-200 flex-shrink-0 shadow-inner" />
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {pol.category}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                        {pol.status}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-slate-400">{pol.code}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs font-medium text-slate-500">{pol.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mb-2">{pol.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{pol.desc}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors">
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Bookmark Statute</span>
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95">
                        <Download className="w-3.5 h-3.5 text-blue-600" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Citizen Rights & Legal Assurance */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-900">Statutory Rights</h3>
              <p className="text-xs text-slate-500 mt-0.5">Your protections under the Civic Charter</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl flex-shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">Guaranteed Service Delivery</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Under Act 14 of the Municipal Governance Code, every citizen has the legal right to track municipal repairs with complete transparency and real-time audit logging.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">SLA Non-Compliance Escrow</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    If a high-priority dispatch breaches its automated timeline, municipal escrow credits are automatically credited to the affected zone's civic trust.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <h4 className="text-base font-bold mb-1">Got Legal Inquiries?</h4>
            <p className="text-xs text-blue-100 mb-4 leading-relaxed">Schedule an official consultation with the Municipal Law Directorate regarding civic policies.</p>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-white text-blue-600 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95">
              <span>Contact Law Directorate</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
