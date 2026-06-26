import { useState, useEffect } from 'react';
import { MessageSquare, Send, Search, Phone, Video, Info, Sparkles, CheckCheck, ShieldCheck } from 'lucide-react';
import { fetchChats, fetchMessages, sendMessageAPI } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function GovChat({ activeChatTarget }) {
  const { user } = useAuth();
  const currentUserRole = user?.role === 'ENGINEER' || user?.role === 'ADMIN' ? 'ENGINEER' : 'CITIZEN';

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(1);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const loadChats = async () => {
      const data = await fetchChats();
      setChats(data);
      if (activeChatTarget && activeChatTarget.id) {
        setActiveChat(activeChatTarget.id);
      } else {
        const storedActive = localStorage.getItem('civic_active_chat_id');
        if (storedActive && data.some(c => c.id === parseInt(storedActive, 10))) {
          setActiveChat(parseInt(storedActive, 10));
        } else if (data.length > 0) {
          setActiveChat(data[0].id);
        }
      }
    };
    loadChats();
  }, [activeChatTarget]);

  useEffect(() => {
    if (activeChat) {
      localStorage.setItem('civic_active_chat_id', activeChat);
      fetchMessages(activeChat).then(msgs => {
        setMessages(msgs);
      });
    }
  }, [activeChat]);

  const selectedChat = chats.find(c => c.id === activeChat) || {
    name: 'Department Representative', rep: 'Support Agent', role: 'Municipal Rep', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', online: true
  };

  const filteredChats = chats.filter(c => 
    (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (c.rep && c.rep.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.citizenName && c.citizenName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.engineerName && c.engineerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getChatDisplayInfo = (chat) => {
    const currentUserName = user?.full_name || user?.name || 'Rahul Sharma';
    
    let universalAvatars = {};
    try {
      const stored = localStorage.getItem('civic_avatars');
      if (stored) universalAvatars = JSON.parse(stored);
    } catch (e) {}

    if (currentUserRole === 'ENGINEER') {
      // Engineer viewing: show the original node name attached to the account, communicating with Citizen (Rahul Sharma)
      let citName = chat.citizenName || 'Rahul Sharma';
      if (citName === user?.name || citName === 'Priya Patel' || citName.includes('Department') || citName.includes('Board') || citName.includes('Bureau') || citName.includes('Division')) {
        citName = 'Rahul Sharma';
      }
      const avatar = universalAvatars[citName] || universalAvatars['CITIZEN'] || chat.citizenAvatar || chat.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
      return {
        name: chat.name || citName,
        rep: citName,
        role: 'Civic Member',
        avatar: avatar,
        online: chat.online !== undefined ? chat.online : true,
        unread: chat.unread || 0,
        lastMessage: chat.lastMessage || ''
      };
    } else {
      // Citizen viewing: show the original node name attached to the account, communicating with Engineer (Priya Patel)
      let engName = chat.engineerName || chat.rep || 'Priya Patel';
      if (engName === 'Citizen Explorer' || engName === 'Citizen' || engName === currentUserName) {
        engName = 'Priya Patel';
      }
      let deptName = chat.name || 'Municipal Department';
      if (deptName === currentUserName || deptName === 'Citizen Explorer' || deptName === 'Citizen' || deptName === 'Citizen Reporter (test...)') {
        deptName = engName === 'Priya Patel' ? 'Priya Patel' : engName;
      }
      let role = chat.engineerRole || chat.role || 'Chief Municipal Engineer';
      if (role.includes('Civic Member') || role.includes('Citizen')) {
        role = 'Chief Municipal Engineer';
      }

      const avatar = universalAvatars[engName] || universalAvatars[deptName] || universalAvatars['ENGINEER'] || chat.engineerAvatar || chat.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80';
      return {
        name: chat.name || deptName,
        rep: engName,
        role: role,
        avatar: avatar,
        online: chat.online !== undefined ? chat.online : true,
        unread: chat.unread || 0,
        lastMessage: chat.lastMessage || ''
      };
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');

    const myRole = currentUserRole;
    const theirRole = currentUserRole === 'ENGINEER' ? 'CITIZEN' : 'ENGINEER';

    // Send my message
    const newMsg = await sendMessageAPI(activeChat, text, myRole);
    setMessages(prev => [...prev, newMsg]);

    // Update chats sidebar lastMessage
    setChats(prev => prev.map(c => c.id === activeChat ? { ...c, lastMessage: text } : c));

    // Simulate real-time live typing and reply from the other party
    setIsTyping(true);
    setTimeout(async () => {
      setIsTyping(false);
      const replies = currentUserRole === 'ENGINEER' ? [
        `Thank you Priya! I appreciate your quick response and dedication to fixing this.`,
        `That sounds great. I will be available if the field unit needs any additional info or directions.`,
        `Understood perfectly! Thank you for the update.`,
        `Great initiative! I'm glad the municipal team is taking swift action.`
      ] : [
        `I've reviewed the details. Let me assign a field unit right now to collaborate with you on this.`,
        `Thank you for bringing this up. I am checking our regional telemetry to fast-track this request.`,
        `Understood perfectly! We are actively coordinating the repair schedule and will keep you updated here.`,
        `Excellent initiative. Let's coordinate closely to ensure this issue is fully resolved to top safety standards.`
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];
      const replyMsg = await sendMessageAPI(activeChat, replyText, theirRole);
      setMessages(prev => [...prev, replyMsg]);
      setChats(prev => prev.map(c => c.id === activeChat ? { ...c, lastMessage: replyText } : c));
    }, 2500);
  };

  const selectedDisp = getChatDisplayInfo(selectedChat);

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
            <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">{chats.length} Live</span>
          </div>

          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search department or agent..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs outline-none focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto px-1 py-1 -mx-1">
            {filteredChats.map((chat) => {
              const disp = getChatDisplayInfo(chat);
              return (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`w-full p-4 rounded-2xl text-left transition-all duration-200 flex items-center gap-4 border ${
                    activeChat === chat.id ? 'bg-white border-slate-200 shadow-md ring-1 ring-blue-500' : 'bg-transparent border-transparent hover:bg-slate-100/80'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img src={disp.avatar} alt={disp.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm" />
                    {disp.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-slate-900 truncate">{disp.name}</span>
                      {disp.unread > 0 && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white font-bold text-[10px] rounded-full shadow-sm">
                          {disp.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>{disp.rep} ({disp.role})</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{disp.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Message Box */}
        <div className="xl:col-span-8 flex flex-col bg-white min-h-[500px]">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-4">
              <img src={selectedDisp.avatar} alt={selectedDisp.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm" />
              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedDisp.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className={`w-2 h-2 rounded-full ${selectedDisp.online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>{selectedDisp.rep} • {selectedDisp.role}</span>
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
            {messages.map((msg) => {
              const isMine = msg.senderRole ? msg.senderRole === currentUserRole : msg.sender === 'me';
              let text = msg.text || '';
              if (text.includes('I am Citizen Explorer.')) {
                text = text.replace('I am Citizen Explorer.', 'I am Priya Patel.');
              }
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm ${
                    isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
                    <div className={`mt-2 flex items-center gap-1 text-[10px] ${isMine ? 'text-blue-100 justify-end' : 'text-slate-400 justify-start'}`}>
                      <span>{msg.time}</span>
                      {isMine && <CheckCheck className="w-3.5 h-3.5 text-blue-200" />}
                    </div>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-500 px-4 py-3 rounded-2xl rounded-bl-none text-xs flex items-center gap-2 animate-pulse">
                  <span>{selectedDisp.name} is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200/80 bg-white flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Send message to ${selectedDisp.name}...`}
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
