type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
};

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <div className="rounded-[1.4rem] border border-[var(--border)] bg-white/[0.04] p-5">
      <div className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">{label}</div>
      <div className="display-font mt-3 text-4xl leading-none">{value}</div>
      {detail ? <div className="mt-2 text-sm leading-6 text-muted">{detail}</div> : null}
    </div>
  );
}
