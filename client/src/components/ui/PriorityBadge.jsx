const priorityConfig = {
  LOW:      { label: 'Low',      bg: 'bg-slate-100', text: 'text-slate-700', icon: '↓' },
  MEDIUM:   { label: 'Medium',   bg: 'bg-blue-100',  text: 'text-blue-700',  icon: '→' },
  HIGH:     { label: 'High',     bg: 'bg-amber-100', text: 'text-amber-700', icon: '↑' },
  CRITICAL: { label: 'Critical', bg: 'bg-rose-100',  text: 'text-rose-700',  icon: '🔥', pulse: true },
};

export default function PriorityBadge({ priority }) {
  const cfg = priorityConfig[priority] || priorityConfig.MEDIUM;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} transition-transform hover:scale-105 ${cfg.pulse ? 'animate-pulse-critical' : ''}`}
    >
      <span className="text-[10px]">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
