import { useState } from 'react';
import { Building2, Search, Phone, Mail, Clock, MapPin, Shield, CheckCircle, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

export default function GovDepartments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);

  const departments = [
    {
      id: 1,
      name: 'Department of Transportation & Transit',
      code: 'DOT',
      director: 'Director Marcus Vance',
      description: 'Manages city roadways, smart traffic signaling, pedestrian crosswalk infrastructure, and rapid municipal transit networks.',
      address: '750 Metro Plaza, Suite 400',
      phone: '+1 (555) 892-0192',
      email: 'contact@transport.civicelite.gov',
      sla: '98.4% SLA Compliance',
      status: 'Fully Operational',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      crewsActive: 24,
      ticketsToday: 142
    },
    {
      id: 2,
      name: 'Water, Sewer & Sanitation Board',
      code: 'WSSB',
      director: 'Commissioner Sarah Lin',
      description: 'Maintains clean municipal drinking water distribution, automated pressure telemetry, storm drainage, and waste management.',
      address: '102 Central Utilities Way',
      phone: '+1 (555) 732-8811',
      email: 'sanitation@wssb.civicelite.gov',
      sla: '99.1% SLA Compliance',
      status: 'Fully Operational',
      image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80',
      crewsActive: 18,
      ticketsToday: 89
    },
    {
      id: 3,
      name: 'Parks, Recreation & Forestry Division',
      code: 'PRFD',
      director: 'Superintendent Aris Thorne',
      description: 'Oversees public parks, playground safety inspections, urban canopy maintenance, and recreational community centers.',
      address: '440 Greendale Botanical Parkway',
      phone: '+1 (555) 432-9001',
      email: 'parks@forestry.civicelite.gov',
      sla: '96.5% SLA Compliance',
      status: 'Minor Maintenance Delays',
      image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=600&q=80',
      crewsActive: 12,
      ticketsToday: 45
    },
    {
      id: 4,
      name: 'Municipal Energy & Microgrid Bureau',
      code: 'MEMB',
      director: 'Chief Engineer Robert Diaz',
      description: 'Regulates municipal smart grid distribution, automated streetlight maintenance, solar arrays, and high-voltage trunk lines.',
      address: '990 Electra Tower, Floor 12',
      phone: '+1 (555) 991-2345',
      email: 'grid@energy.civicelite.gov',
      sla: '99.9% SLA Compliance',
      status: 'Fully Operational',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
      crewsActive: 31,
      ticketsToday: 210
    },
    {
      id: 5,
      name: 'Housing & Civic Infrastructure Agency',
      code: 'HCIA',
      director: 'Administrator Elena Rostova',
      description: 'Enforces municipal building codes, structural safety evaluations, public sidewalk leveling, and zoning accessibility certificates.',
      address: '250 Civic Governance Building',
      phone: '+1 (555) 321-7654',
      email: 'buildings@housing.civicelite.gov',
      sla: '97.2% SLA Compliance',
      status: 'Fully Operational',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      crewsActive: 15,
      ticketsToday: 67
    }
  ];

  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="lg:col-span-9 xl:col-span-10 h-full overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Executive Civic Hierarchy</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Government Departments & Divisions</h1>
            <p className="text-slate-100 text-sm max-w-2xl leading-relaxed">
              Explore official municipal bureaus, verify active field dispatch units, examine real-time SLA accountability metrics, and access direct executive communications.
            </p>
          </div>

          <div className="relative w-full md:w-72 flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bureau, code, or function..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-xs outline-none focus:border-blue-500 transition-all shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDepts.map((dept) => (
          <div key={dept.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group">
            <div>
              {/* Image Banner */}
              <div className="h-48 w-full overflow-hidden relative">
                <img src={dept.image} alt={dept.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm">
                    {dept.code}
                  </span>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm flex items-center gap-1 ${
                    dept.status === 'Fully Operational' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {dept.status === 'Fully Operational' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    <span>{dept.status}</span>
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{dept.name}</h3>
                  <p className="text-xs text-blue-200 font-medium">{dept.director}</p>
                </div>
              </div>

              {/* Department Body */}
              <div className="p-6 space-y-5">
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                  {dept.description}
                </p>

                {/* Live Stats */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Active Field Crews</p>
                    <p className="text-lg font-black text-slate-900">{dept.crewsActive} Crews</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Today</p>
                    <p className="text-lg font-black text-blue-600">{dept.ticketsToday} Tickets</p>
                  </div>
                </div>

                {/* Contact Telemetry */}
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{dept.address}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{dept.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{dept.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 font-bold text-emerald-600 pt-1">
                    <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{dept.sla} Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-6 pt-0">
              <button
                onClick={() => window.location.href = `mailto:${dept.email}`}
                className="w-full py-3 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 border border-slate-100 shadow-sm active:scale-95"
              >
                <span>Contact Department Desk</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
