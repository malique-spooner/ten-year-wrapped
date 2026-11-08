import type { ReactNode } from "react";

type ChipProps = {
  children: ReactNode;
};

export function Chip({ children }: ChipProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 text-sm text-ink backdrop-blur-sm">
      {children}
    </span>
  );
}
