import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('civic_theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark-theme');
    } else {
      setIsDark(false);
      document.body.classList.remove('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('civic_theme', 'light');
      setIsDark(false);
    } else {
      document.body.classList.add('dark-theme');
      localStorage.setItem('civic_theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <button
        onClick={toggleTheme}
        className={`group flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 border ${
          isDark 
            ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30 shadow-amber-500/10' 
            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-slate-400/30'
        }`}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 ${
          isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-100 text-slate-700'
        }`}>
          {isDark ? <Sun className="w-4.5 h-4.5 animate-pulse" /> : <Moon className="w-4.5 h-4.5" />}
        </div>
        <div className="text-left pr-1">
          <p className="text-[10px] uppercase tracking-widest font-black leading-none mb-1 opacity-60">
            {isDark ? 'Appearance' : 'Appearance'}
          </p>
          <p className="text-xs font-black tracking-tight leading-none">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </p>
        </div>
      </button>
    </div>
  );
}
