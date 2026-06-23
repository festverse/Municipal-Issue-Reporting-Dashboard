export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-slate-200"
          style={{ borderTopColor: 'var(--accent-blue)' , animation: 'spin-ring 1s linear infinite' }}
        />
        {/* Inner ring */}
        <div
          className="absolute inset-2 rounded-full border-2 border-slate-200"
          style={{ borderBottomColor: 'var(--accent-violet)', animation: 'spin-ring 0.8s linear infinite reverse' }}
        />
        {/* Center dot */}
        <div className="absolute inset-5 rounded-full bg-blue-500/30" />
      </div>
      {text && (
        <p className="mt-4 text-sm text-slate-500 font-medium tracking-wide">{text}</p>
      )}
    </div>
  );
}
