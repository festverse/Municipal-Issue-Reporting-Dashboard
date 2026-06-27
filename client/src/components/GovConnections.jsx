import { useState } from 'react';
import { Users, Search, Filter, ShieldCheck, Star, Award, MessageSquare, Plus, Sparkles, UserPlus } from 'lucide-react';

export default function GovConnections({ onStartChat }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTier, setActiveTier] = useState('ALL');

  const connections = [
    { id: 1, name: 'Dr. Evelyn Vance', role: 'Chief Municipal Engineer', tier: 'Civic Elite', issues: 142, rating: '4.9', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', mutual: '3 Active Initiatives', verified: true },
    { id: 2, name: 'Marcus Sterling', role: 'Downtown Neighborhood Lead', tier: 'Pioneer', issues: 84, rating: '4.8', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', mutual: '1 Active Initiative', verified: true },
    { id: 3, name: 'Sarah Jenkins', role: 'Green Space Coordinator', tier: 'Pioneer', issues: 63, rating: '4.7', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80', mutual: '2 Active Initiatives', verified: false },
    { id: 4, name: 'David Thorne', role: 'Transit Watch Member', tier: 'Supporter', issues: 29, rating: '4.5', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', mutual: 'No Mutual Initiatives', verified: false },
    { id: 5, name: 'Elena Rostova', role: 'Water Security Advisor', tier: 'Civic Elite', issues: 115, rating: '4.9', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80', mutual: '4 Active Initiatives', verified: true },
    { id: 6, name: 'Thomas Chen', role: 'Community Patrol Lead', tier: 'Pioneer', issues: 76, rating: '4.8', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', mutual: '1 Active Initiative', verified: true },
  ];

  const filteredConnections = connections.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = activeTier === 'ALL' || c.tier === activeTier;
    return matchesSearch && matchesTier;
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
              <span>Civic Peer Network</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Community Connections & Verified Leaders</h1>
            <p className="text-slate-100 text-sm max-w-2xl leading-relaxed">
              Connect with municipal engineers, neighborhood coordinators, and active citizens to co-sponsor civic initiatives and coordinate local solutions.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white text-blue-600 hover:bg-slate-50 font-bold text-xs rounded-2xl transition-all shadow-lg active:scale-95 whitespace-nowrap">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span>Invite Fellow Citizen</span>
          </button>
        </div>
      </div>

      {/* Main Directory Area */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Verified Civic Directory</h3>
            <p className="text-xs text-slate-500 mt-0.5">Filter by engagement tier or search by name</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name or title..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
              {['ALL', 'Civic Elite', 'Pioneer', 'Supporter'].map((tr) => (
                <button
                  key={tr}
                  onClick={() => setActiveTier(tr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTier === tr ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {filteredConnections.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-900 mb-1">No connections found</h4>
            <p className="text-xs text-slate-500">Try adjusting your search criteria or engagement filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredConnections.map((conn) => (
              <div key={conn.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img src={conn.avatar} alt={conn.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0" />
                    {conn.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Verified Leader">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-slate-900 truncate">{conn.name}</h4>
                    <p className="text-xs text-blue-600 font-medium mb-2 truncate">{conn.role}</p>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      conn.tier === 'Civic Elite' ? 'bg-violet-100 text-violet-700 border border-violet-200' :
                      conn.tier === 'Pioneer' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {conn.tier}
                    </span>
                  </div>
                </div>

                <div className="py-3 px-4 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-600 font-medium">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>{conn.issues} Issues Solved</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-800 font-bold">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{conn.rating}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{conn.mutual}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onStartChat && onStartChat({ id: conn.id + 1000, name: conn.name, role: conn.role, avatar: conn.avatar })} className="p-2 bg-white hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-xl border border-slate-200 transition-all shadow-sm active:scale-95" title="Start Chat">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button onClick={() => onStartChat && onStartChat({ id: conn.id + 1000, name: conn.name, role: conn.role, avatar: conn.avatar })} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
