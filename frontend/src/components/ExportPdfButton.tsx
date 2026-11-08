"use client";

import { motion } from "framer-motion";

type ExportPdfButtonProps = {
  className?: string;
};

export function ExportPdfButton({ className = "" }: ExportPdfButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={() => window.print()}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`no-print inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white hover:text-black ${className}`}
    >
      Export PDF
      <span aria-hidden="true">↗</span>
    </motion.button>
  );
}
