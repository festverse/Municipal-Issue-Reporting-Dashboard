const statusConfig = {
  OPEN:        { label: 'Open',        bg: 'bg-amber-100',   text: 'text-amber-700',  dot: 'bg-amber-500' },
  ASSIGNED:    { label: 'Assigned',    bg: 'bg-blue-100',    text: 'text-blue-700',   dot: 'bg-blue-500' },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-violet-100',  text: 'text-violet-700', dot: 'bg-violet-500' },
  RESOLVED:    { label: 'Resolved',    bg: 'bg-emerald-100', text: 'text-emerald-700',dot: 'bg-emerald-500' },
  REJECTED:    { label: 'Rejected',    bg: 'bg-rose-100',    text: 'text-rose-700',   dot: 'bg-rose-500' },
};

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.OPEN;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} transition-transform hover:scale-105`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
