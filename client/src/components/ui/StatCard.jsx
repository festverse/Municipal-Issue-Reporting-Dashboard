import { useEffect, useRef, useState } from 'react';

const colorMap = {
  blue:    { border: 'border-l-blue-500',   glow: 'from-blue-500/10' },
  emerald: { border: 'border-l-emerald-500', glow: 'from-emerald-500/10' },
  amber:   { border: 'border-l-amber-500',   glow: 'from-amber-500/10' },
  violet:  { border: 'border-l-violet-500',  glow: 'from-violet-500/10' },
  rose:    { border: 'border-l-rose-500',     glow: 'from-rose-500/10' },
};

export default function StatCard({ icon, label, value, color = 'blue', delay = 0 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const c = colorMap[color] || colorMap.blue;

  useEffect(() => {
    const target = typeof value === 'number' ? value : parseInt(value, 10) || 0;
    if (target === 0) { setDisplay(0); return; }

    const timeout = setTimeout(() => {
      const duration = 800;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.floor(ease * target));
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <div
      ref={ref}
      className={`ui-card border-l-4 ${c.border} p-5 animate-fade-in-up transition-transform hover:scale-[1.03] hover:shadow-lg cursor-default`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${c.glow} to-transparent rounded-2xl pointer-events-none`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold tracking-tight text-slate-900">
          {typeof value === 'string' && value.includes('.') ? value : display}
        </p>
      </div>
    </div>
  );
}
