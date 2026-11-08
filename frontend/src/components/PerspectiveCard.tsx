"use client";

import { motion } from "framer-motion";

type PerspectiveCardProps = {
  title: string;
  body: string;
  accent?: "accent" | "accent2" | "accent3";
};

export function PerspectiveCard({ title, body, accent = "accent" }: PerspectiveCardProps) {
  const accentMap = {
    accent: "from-[rgba(203,95,47,0.12)]",
    accent2: "from-[rgba(36,93,99,0.12)]",
    accent3: "from-[rgba(139,107,45,0.12)]",
  } as const;

  return (
    <motion.div
      whileHover={{ rotateX: 4, rotateY: -6, y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`glass h-full rounded-[1.5rem] bg-gradient-to-br ${accentMap[accent]} to-transparent p-5`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="mb-3 h-3 w-3 rounded-full bg-accent" />
      <h3 className="display-font text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{body}</p>
    </motion.div>
  );
}
