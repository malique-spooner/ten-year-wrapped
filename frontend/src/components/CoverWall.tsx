"use client";

import { motion } from "framer-motion";

import type { TopTrack } from "@/data/prototype";

type CoverWallProps = {
  tracks: TopTrack[];
};

const fallbackGradients = [
  "from-[#111111] via-[#313131] to-[#050505]",
  "from-[#242424] via-[#575757] to-[#050505]",
  "from-[#1b1b1b] via-[#3f3f3f] to-[#050505]",
  "from-[#0f0f0f] via-[#444444] to-[#050505]",
];

export function CoverWall({ tracks }: CoverWallProps) {
  if (!tracks.length) {
    return null;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {tracks.map((track, index) => {
        const hasCover = Boolean(track.coverUrl);
        const gradient = fallbackGradients[index % fallbackGradients.length];

        return (
          <motion.article
            key={track.trackId}
            initial={{ opacity: 0, y: 18, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.55, delay: index * 0.04 }}
            whileHover={{ y: -8, rotateY: -6, rotateX: 4 }}
            className="group relative overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-white/[0.04] shadow-[0_16px_32px_rgba(0,0,0,0.24)]"
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} ${hasCover ? "opacity-20" : "opacity-[0.35]"}`} />
            {hasCover ? (
              <img
                src={track.coverUrl as string}
                alt={`${track.trackName} cover art`}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            ) : null}
            <div className={`absolute inset-0 ${hasCover ? "bg-black/52" : "bg-transparent"}`} />
            <div className="relative flex min-h-[18rem] flex-col justify-between p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-full border border-white/20 bg-black/24 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-white">
                  #{track.rank}
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
                  {Math.round(track.secondsTotal).toLocaleString()} s
                </div>
              </div>

              <div className="space-y-2">
                <div className="max-w-[15ch] text-3xl font-semibold leading-[0.92] tracking-[-0.04em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
                  {track.trackName}
                </div>
                <div className="text-sm font-medium text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
                  {track.artistName}
                </div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/70">
                  {track.albumName ?? "Signature track"}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-white/72">
                <span>{hasCover ? "Album cover" : "Poster fallback"}</span>
                <span className="opacity-80">signature record</span>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
