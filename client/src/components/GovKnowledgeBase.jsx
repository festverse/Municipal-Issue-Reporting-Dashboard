import { useState } from 'react';
import { HelpCircle, Search, BookOpen, ChevronDown, ChevronUp, Sparkles, FileText, Bookmark, ExternalLink } from 'lucide-react';

export default function GovKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(1);
  const [activeTab, setActiveTab] = useState('ALL');

  const faqs = [
    { id: 1, question: 'How does the AI Dispatch & SLA Guarantee work?', answer: 'When you submit an issue, our neural routing engine automatically classifies the complaint by severity and geographic zone, assigning it directly to active field crews with a legally binding SLA target (e.g., 2 hours for Critical hazards).' },
    { id: 2, question: 'Can I track my reported issue without creating an account?', answer: 'Yes. Every submitted ticket generates a unique public Tracking Hash (e.g., #TICK-8921). You can enter this code in the search bar on the Community Feed to view real-time status updates and photo evidence.' },
    { id: 3, question: 'What happens if a municipal department breaches its SLA?', answer: 'If a high-priority dispatch fails to meet its resolution window, automated escalation protocols notify the Municipal Executive Board and allocate civic escrow credits back to the neighborhood trust.' },
    { id: 4, question: 'How do I get my citizen profile verified as a Civic Leader?', answer: 'Citizen verification is awarded after co-sponsoring 5 active community initiatives or successfully submitting 20 verified municipal reports that lead to confirmed field resolutions.' },
    { id: 5, question: 'What types of photo evidence are accepted by the automated triage?', answer: 'Our platform accepts standard JPEG/PNG uploads as well as live camera captures. For best results, ensure the issue (such as a pothole or water leak) is clearly illuminated and includes surrounding landmarks for spatial orientation.' },
  ];

  const guides = [
    { id: 101, title: 'Civic Reporting Best Practices & Landmark Guidelines', category: 'Getting Started', readTime: '4 min read', image: 'https://picsum.photos/id/1029/600/400' },
    { id: 102, title: 'Understanding Your Statutory Rights under the SLA Charter', category: 'Legal Framework', readTime: '7 min read', image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80' },
    { id: 103, title: 'How to Co-Sponsor Neighborhood Improvement Initiatives', category: 'Community Engagement', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80' },
  ];

  const filteredFaqs = faqs.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="lg:col-span-9 xl:col-span-10 h-full overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Municipal Knowledge Repository</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Help Center & Knowledge Base</h1>
            <p className="text-slate-100 text-sm max-w-2xl leading-relaxed">
              Explore comprehensive guides, review the automated municipal SLA charter, and find answers to all your civic reporting questions.
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white text-blue-600 hover:bg-slate-50 font-bold text-xs rounded-2xl transition-all shadow-lg active:scale-95 whitespace-nowrap">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Download Full Guide</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: FAQ Accordion */}
        <div className="xl:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h3>
              <p className="text-xs text-slate-500 mt-0.5">Click any question to expand official municipal answers</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions or terms..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900 mb-1">No questions found</h4>
              <p className="text-xs text-slate-500">Try modifying your search query to find related answers.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div key={faq.id} className="rounded-2xl border border-slate-200/80 overflow-hidden bg-slate-50/50 transition-all duration-300">
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-100/50 transition-colors"
                    >
                      <span className="text-sm">{faq.question}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Civic Guides with Dummy Images */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-slate-900">Featured Guides</h3>
              <p className="text-xs text-slate-500 mt-0.5">Verified civic knowledge base articles</p>
            </div>

            <div className="space-y-6">
              {guides.map((gd) => (
                <div key={gd.id} className="group cursor-pointer bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                  <div className="h-32 w-full overflow-hidden relative">
                    <img src={gd.image} alt={gd.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 bg-blue-600 text-white rounded-full shadow-sm">
                      {gd.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{gd.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-200/60">
                      <span>{gd.readTime}</span>
                      <span className="text-blue-600 font-bold flex items-center gap-1">
                        <span>Read Article</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
