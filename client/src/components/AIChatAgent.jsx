import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Minus, MessageSquareCode, CheckCheck, Cpu, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
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
  const [isListening, setIsListening] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const selectedVoiceRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isLoading, isListening]);

  const getBestMaleVoice = () => {
    if (selectedVoiceRef.current) return selectedVoiceRef.current;
    if (!window.speechSynthesis) return null;

    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Explicitly list premium natural male voices across Windows, macOS, Chrome, Edge, iOS, Android
    const maleVoiceKeywords = [
      'Google UK English Male',
      'Google US English Male',
      'Microsoft David',
      'Microsoft Mark',
      'Microsoft Brian',
      'Microsoft George',
      'Daniel',
      'Oliver',
      'Arthur',
      'James',
      'Bradley',
      'Alex',
      'Fred',
      'Aaron',
      'en-US-Wavenet-D',
      'en-GB-Wavenet-B',
      'Male',
      'male'
    ];

    // Explicitly EXCLUDE known female voices so it NEVER accidentally picks one
    const femaleExclusions = ['zira', 'siri', 'female', 'hazel', 'samantha', 'victoria', 'karen', 'veena', 'tessa', 'ava', 'allison', 'susan', 'catherine', 'eva', 'grace', 'zoe'];

    let bestVoice = null;

    // Try to find exact match in premium male voices list
    for (const keyword of maleVoiceKeywords) {
      const found = voices.find(v => {
        const name = v.name.toLowerCase();
        if (femaleExclusions.some(f => name.includes(f))) return false;
        return v.name.includes(keyword);
      });
      if (found) {
        bestVoice = found;
        break;
      }
    }

    // Fallback: If no keyword match, find ANY voice that doesn't contain female names and is English
    if (!bestVoice) {
      bestVoice = voices.find(v => {
        const name = v.name.toLowerCase();
        if (femaleExclusions.some(f => name.includes(f))) return false;
        return v.lang.startsWith('en');
      });
    }

    // Last resort fallback
    if (!bestVoice) {
      bestVoice = voices[0];
    }

    if (bestVoice) {
      selectedVoiceRef.current = bestVoice;
    }

    return bestVoice;
  };

  // Initialize Speech Recognition on mount
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
        getBestMaleVoice(); // Proactively cache and lock in the best male voice once loaded
      };
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [messages]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please try Google Chrome, Microsoft Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (isSpeaking && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const cleanTextForSpeech = (text) => {
    if (!text) return '';
    return text
      .replace(/#+\s/g, '') // remove header hashes
      .replace(/\*\*/g, '') // remove bold asterisks
      .replace(/\*/g, '') // remove bullet asterisks
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '') // remove emojis
      .replace(/\s+/g, ' ') // normalize whitespace
      .trim();
  };

  const speakText = (text) => {
    if (!window.speechSynthesis || !voiceMode) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const selectedVoice = getBestMaleVoice();

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.pitch = 0.95; // Slightly deeper, natural male resonance
    utterance.rate = 1.05; // Smooth, natural human conversational pacing

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!textToSend) setInputText('');
    if (isSpeaking && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

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

      if (voiceMode) {
        speakText(replyText);
      }
    }, 1500);
  };

  const renderMessageText = (text, isAi) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, lineIndex) => {
      if (!line.trim()) return <div key={lineIndex} className="h-2" />;

      // Check for headers
      if (line.startsWith('### ')) {
        return (
          <h4 key={lineIndex} className={`font-bold text-sm sm:text-base mb-2 border-b pb-1 ${isAi ? 'text-slate-900 border-slate-100' : 'text-white border-blue-500'}`}>
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={lineIndex} className={`font-extrabold text-base sm:text-lg mb-2 border-b pb-1 ${isAi ? 'text-slate-900 border-slate-100' : 'text-white border-blue-500'}`}>
            {line.replace('## ', '')}
          </h3>
        );
      }

      // Check for bullet points
      let isBullet = false;
      let cleanLine = line;
      if (cleanLine.trim().startsWith('* ')) {
        isBullet = true;
        cleanLine = cleanLine.trim().substring(2);
      } else if (cleanLine.trim().startsWith('- ')) {
        isBullet = true;
        cleanLine = cleanLine.trim().substring(2);
      }

      // Parse bold text (**text**) and emphasis (*text*)
      const parts = cleanLine.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      const renderedParts = parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIndex} className={`font-bold ${isAi ? 'text-slate-900' : 'text-white'}`}>
              {part.slice(2, -2)}
            </strong>
          );
        } else if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <strong key={partIndex} className={`font-semibold ${isAi ? 'text-slate-900' : 'text-white'}`}>
              {part.slice(1, -1)}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={lineIndex} className="flex items-start gap-2 my-1 pl-2">
            <span className={`font-bold select-none ${isAi ? 'text-blue-500' : 'text-blue-200'}`}>•</span>
            <div className="flex-1">{renderedParts}</div>
          </div>
        );
      }

      return (
        <div key={lineIndex} className="my-1 leading-relaxed">
          {renderedParts}
        </div>
      );
    });
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
          className="pointer-events-auto w-full w-[380px] sm:w-[440px] h-[540px] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col mb-3 overflow-hidden animate-fade-in-up"
        >
          {/* Top Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-4 text-white shadow-md relative overflow-hidden flex items-center justify-between flex-shrink-0 gap-2">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2.5 relative z-10 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner flex-shrink-0">
                <Cpu className="w-5 h-5 text-blue-100 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black tracking-tight truncate">Chief AI Municipal Advisor</h3>
                  <Sparkles className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
                </div>
                <p className="text-[11px] text-slate-100 font-medium truncate">Senior Civic Tech & Engineering Expert</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 relative z-10 flex-shrink-0">
              <button
                onClick={() => {
                  if (isSpeaking && window.speechSynthesis) window.speechSynthesis.cancel();
                  setVoiceMode(!voiceMode);
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl transition-all backdrop-blur-md border text-[11px] font-bold shadow-sm active:scale-95 ${
                  voiceMode 
                    ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30 hover:bg-emerald-500/30' 
                    : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20'
                }`}
                title={voiceMode ? "AI Voice Active (Male Expert)" : "AI Voice Muted"}
              >
                {voiceMode ? <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-speaker-waves text-emerald-300' : ''}`} /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{voiceMode ? 'Unmute' : 'Muted'}</span>
              </button>
              <button
                onClick={() => {
                  if (isSpeaking && window.speechSynthesis) window.speechSynthesis.cancel();
                  setIsOpen(false);
                }}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md border border-white/10 active:scale-95 shadow-sm"
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
                    <div className="space-y-2 leading-relaxed text-xs sm:text-sm">
                      {renderMessageText(msg.text, isAi)}
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

          {/* Listening Status Banner */}
          {isListening && (
            <div className="px-4 py-2 bg-rose-500/10 border-t border-rose-200 flex items-center justify-between gap-3 flex-shrink-0 animate-pulse pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span className="text-xs font-bold text-rose-700">Listening to your voice... Speak now</span>
              </div>
              <button onClick={toggleListening} className="text-[10px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer">
                Cancel
              </button>
            </div>
          )}

          {/* Message Input Box with Microphone Button */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 border-t border-slate-200/80 bg-white flex items-center gap-2 flex-shrink-0 pointer-events-auto"
          >
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-2xl border transition-all shadow-sm active:scale-95 flex items-center justify-center flex-shrink-0 ${
                isListening
                  ? 'bg-rose-600 border-rose-600 text-white animate-pulse shadow-rose-500/30 shadow-md'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-blue-600'
              }`}
              title={isListening ? "Stop Listening" : "Talk with Voice"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask AI Advisor anything..."}
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
