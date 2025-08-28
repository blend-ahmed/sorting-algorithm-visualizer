export function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-2 py-1 shadow">
      <span className={`h-3 w-3 rounded ${color}`} />
      <span>{label}</span>
    </div>
  );
}
