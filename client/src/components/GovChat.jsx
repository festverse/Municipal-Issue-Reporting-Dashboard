import { useState } from 'react';
import { MessageSquare, Send, Search, Phone, Video, Info, Sparkles, CheckCheck, ShieldCheck } from 'lucide-react';

export default function GovChat() {
  const [activeChat, setActiveChat] = useState(1);
  const [inputText, setInputText] = useState('');

  const chats = [
    { id: 1, name: 'Department of Transportation', rep: 'Officer Davis', role: 'Transit Dispatcher', unread: 0, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', online: true, lastMessage: 'The crew has been dispatched to Main Street.' },
    { id: 2, name: 'Water & Sanitation Board', rep: 'Elena Rostova', role: 'Chief Sanitizer', unread: 2, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', online: true, lastMessage: 'We are monitoring the pipeline pressure now.' },
    { id: 3, name: 'Parks & Recreation Division', rep: 'Marcus Sterling', role: 'Landscaping Lead', unread: 0, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', online: false, lastMessage: 'The broken playground swing will be replaced tomorrow.' },
    { id: 4, name: 'Municipal Energy Bureau', rep: 'Thomas Chen', role: 'Microgrid Admin', unread: 0, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', online: true, lastMessage: 'Power restored across Zone 4 sectors.' },
  ];

  const [messages, setMessages] = useState({
    1: [
      { id: 101, sender: 'them', text: 'Hello! You have reached the Department of Transportation dispatch desk. How may I assist your civic inquiry today?', time: '10:14 AM' },
      { id: 102, sender: 'me', text: 'Hi Officer Davis, I wanted to check the status of the pothole repair on Main Street reported yesterday.', time: '10:15 AM' },
      { id: 103, sender: 'them', text: 'The crew has been dispatched to Main Street. We expect full asphalt curing by 4:00 PM today.', time: '10:16 AM' },
    ],
    2: [
      { id: 201, sender: 'them', text: 'Greetings from Water & Sanitation. We received your water pressure alert.', time: '09:20 AM' },
      { id: 202, sender: 'them', text: 'We are monitoring the pipeline pressure now.', time: '09:21 AM' },
    ],
    3: [
      { id: 301, sender: 'them', text: 'The broken playground swing will be replaced tomorrow.', time: 'Yesterday' },
    ],
    4: [
      { id: 401, sender: 'them', text: 'Power restored across Zone 4 sectors.', time: 'June 22' },
    ]
  });

  const selectedChat = chats.find(c => c.id === activeChat);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMsg = { id: Date.now(), sender: 'me', text: inputText, time: 'Just now' };
    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMsg]
    }));
    setInputText('');
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
              <span>Real-Time Municipal Support</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Direct Department Chat & AI Triage</h1>
            <p className="text-slate-100 text-sm max-w-2xl leading-relaxed">
              Initiate live encrypted chat sessions with official municipal department representatives, track ongoing ticket communications, and receive rapid dispatcher support.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 xl:grid-cols-12 min-h-[600px]">
        {/* Contacts Sidebar */}
        <div className="xl:col-span-4 border-b xl:border-b-0 xl:border-r border-slate-200/80 bg-slate-50/50 p-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Active Chat Nodes</h3>
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">4 Live</span>
          </div>

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search department or agent..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs outline-none focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-1 py-1 -mx-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-200 flex items-center gap-4 border ${
                  activeChat === chat.id ? 'bg-white border-slate-200 shadow-md ring-1 ring-blue-500' : 'bg-transparent border-transparent hover:bg-slate-100/80'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm" />
                  {chat.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-900 truncate">{chat.name}</span>
                    {chat.unread > 0 && (
                      <span className="px-2 py-0.5 bg-blue-600 text-white font-bold text-[10px] rounded-full shadow-sm">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>{chat.rep} ({chat.role})</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Message Box */}
        <div className="xl:col-span-8 flex flex-col bg-white min-h-[500px]">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
              <img src={selectedChat.avatar} alt={selectedChat.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm" />
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedChat.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className={`w-2 h-2 rounded-full ${selectedChat.online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>{selectedChat.rep} • {selectedChat.role}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2.5 bg-white hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-xl border border-slate-200 transition-all shadow-sm active:scale-95">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2.5 bg-white hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-xl border border-slate-200 transition-all shadow-sm active:scale-95">
                <Video className="w-4 h-4" />
              </button>
              <button className="p-2.5 bg-white hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-xl border border-slate-200 transition-all shadow-sm active:scale-95">
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Viewport */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20 scrollbar-thin scrollbar-thumb-slate-200">
            {(messages[activeChat] || []).map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                  msg.sender === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className={`mt-2 flex items-center gap-1 text-[10px] ${msg.sender === 'me' ? 'text-blue-100 justify-end' : 'text-slate-400 justify-start'}`}>
                    <span>{msg.time}</span>
                    {msg.sender === 'me' && <CheckCheck className="w-3.5 h-3.5 text-blue-200" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200/80 bg-white flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Send message to ${selectedChat.name}...`}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-blue-500/25 active:scale-95 flex items-center gap-2 flex-shrink-0"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
