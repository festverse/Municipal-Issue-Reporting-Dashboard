import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Minus, MessageSquareCode, CheckCheck, Cpu } from 'lucide-react';
import { chatWithAiAPI } from '../api/client';

export default function AIChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `### 🏛️ Chief Municipal AI Advisor & Engineering Expert\n\nGreetings! I am your AI Advisor and Senior Civic Engineering Expert. I maintain full operational and telemetry oversight across the **Civic Portal**.\n\nHere are key areas where I can provide expert guidance and recommendations:\n1. 📋 **Submitting & Tracking Hazard Reports** (Potholes, Water Leaks, Streetlights, etc.)\n2. 🗺️ **Navigating the Live AI Spatial Heatmap & Telemetry Grid**\n3. 🏛️ **Communicating with Official Government Departments & Engineers**\n4. 🏆 **Earning Civic Rewards, Credits, and Community Badges**\n\n**💡 How may I collaborate with you or clarify our municipal workflows today?**`,
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!textToSend) setInputText('');

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Format history for API
    const history = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text
    }));

    setTimeout(async () => {
      const replyText = await chatWithAiAPI(text, history);
      setIsLoading(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  const quickPrompts = [
    "How do I report a severe pothole?",
    "How do Civic Rewards & Credits work?",
    "Explain the AI spatial heatmap",
    "What are the municipal department workflows?"
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none">
      {/* AI Chat Window Modal */}
      {isOpen && (
        <div 
          data-lenis-prevent="true"
          className="pointer-events-auto w-full w-[350px] sm:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col mb-3 overflow-hidden animate-fade-in-up"
        >
          {/* Top Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-4 text-white shadow-md relative overflow-hidden flex items-center justify-between flex-shrink-0">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Cpu className="w-5 h-5 text-blue-100 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black tracking-tight">Chief AI Municipal Advisor</h3>
                  <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                </div>
                <p className="text-[11px] text-slate-100 font-medium">Senior Civic Tech & Engineering Expert</p>
              </div>
            </div>
            <div className="flex items-center gap-1 relative z-10">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md border border-white/10 active:scale-95 shadow-sm"
                title="Minimize AI Advisor"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Viewport */}
          <div 
            data-lenis-prevent="true" 
            className="flex-1 p-4 overflow-y-auto overscroll-contain space-y-4 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200 text-sm pointer-events-auto"
          >
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div key={msg.id} className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm ${
                    isAi ? 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'
                  }`}>
                    <div className="space-y-2 leading-relaxed whitespace-pre-wrap text-xs sm:text-sm">
                      {msg.text}
                    </div>
                    <div className={`mt-1.5 flex items-center gap-1 text-[10px] ${isAi ? 'text-slate-400 justify-start' : 'text-blue-100 justify-end'}`}>
                      <span>{msg.time}</span>
                      {!isAi && <CheckCheck className="w-3.5 h-3.5 text-blue-200" />}
                    </div>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200/80 text-slate-500 px-4 py-3 rounded-2xl rounded-bl-none text-xs flex items-center gap-2 shadow-sm animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                  <span className="font-semibold text-slate-600">Chief AI Advisor is analyzing municipal telemetry...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div 
            data-lenis-prevent="true"
            className="px-4 py-2 bg-slate-100/80 border-t border-slate-200/60 overflow-x-auto overscroll-contain flex items-center gap-2 scrollbar-none flex-shrink-0 pointer-events-auto"
          >
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap shadow-sm active:scale-95"
              >
                💡 {qp}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 border-t border-slate-200/80 bg-white flex items-center gap-2.5 flex-shrink-0 pointer-events-auto"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask AI Advisor anything..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-xs font-medium outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-blue-500/25 active:scale-95 flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto group flex items-center gap-3 pl-4 pr-5 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 border border-white/20"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <MessageSquareCode className="w-4.5 h-4.5 text-blue-100 animate-pulse transform translate-y-[1px] translate-x-[0.5px]" />
          </div>
          <div className="text-left">
            <p className="text-[10px] text-blue-100 uppercase tracking-widest font-black leading-none mb-1">AI Advisor</p>
            <p className="text-xs font-black tracking-tight leading-none">Chat with AI Expert</p>
          </div>
          <Sparkles className="w-4 h-4 text-blue-200 ml-1 opacity-80 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
        </button>
      )}
    </div>
  );
}
