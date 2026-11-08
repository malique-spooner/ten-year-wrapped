"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import type { ListeningSnapshot, TopArtist, TopGenre, TopTrack } from "@/data/prototype";

type ExplorerTab = "artists" | "tracks" | "genres" | "peaks";

type InsightExplorerProps = {
  snapshot: ListeningSnapshot;
  topArtists: TopArtist[];
  topGenres: TopGenre[];
  topTracks: TopTrack[];
};

function percent(value: number, max: number) {
  if (!max) return 0;
  return Math.max(6, Math.min(100, (value / max) * 100));
}

function formatSeconds(value: number) {
  if (value >= 3600) {
    return `${(value / 3600).toFixed(1)} h`;
  }
  return `${Math.round(value).toLocaleString()} s`;
}

function tabLabel(tab: ExplorerTab) {
  switch (tab) {
    case "artists":
      return "Artists";
    case "tracks":
      return "Tracks";
    case "genres":
      return "Genres";
    case "peaks":
      return "Peaks";
  }
}

export function InsightExplorer({ snapshot, topArtists, topGenres, topTracks }: InsightExplorerProps) {
  const [tab, setTab] = useState<ExplorerTab>("artists");

  const maxArtistSeconds = useMemo(
    () => Math.max(...topArtists.map((item) => item.secondsTotal), 1),
    [topArtists],
  );
  const maxGenreCount = useMemo(
    () => Math.max(...topGenres.map((item) => item.count), 1),
    [topGenres],
  );
  const maxTrackSeconds = useMemo(
    () => Math.max(...topTracks.map((item) => item.secondsTotal), 1),
    [topTracks],
  );
  const maxPeakHours = useMemo(
    () => Math.max(...snapshot.peakPeriods.map((period) => period.hours), 1),
    [snapshot.peakPeriods],
  );

  const tabs: Array<{ id: ExplorerTab; label: string; detail: string }> = [
    { id: "artists", label: "Artists", detail: `${topArtists.length} ranked artists` },
    { id: "tracks", label: "Tracks", detail: `${topTracks.length} tracks with artwork` },
    { id: "genres", label: "Genres", detail: `${topGenres.length} genre signals` },
    { id: "peaks", label: "Peaks", detail: `${snapshot.peakPeriods.length} listening windows` },
  ];

  return (
    <div className="rounded-[2rem] border border-[var(--border)] bg-white/[0.04] p-4 shadow-[0_20px_45px_rgba(0,0,0,0.24)] backdrop-blur">
      <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-muted">
            Interactive charts
          </div>
          <div className="display-font mt-2 text-3xl md:text-4xl">Export explorer</div>
        </div>
        <div className="text-sm text-muted">
          {tabLabel(tab)} selected
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-full border px-4 py-2 text-left transition ${
                active
                  ? "border-white bg-white text-black"
                  : "border-[var(--border)] bg-white/5 text-ink hover:border-white/30"
              }`}
            >
              <div className="text-sm font-semibold">{item.label}</div>
              <div className={`text-[0.72rem] uppercase tracking-[0.18em] ${active ? "text-black/65" : "text-muted"}`}>
                {item.detail}
              </div>
            </button>
          );
        })}
      </div>

      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-5"
      >
        {tab === "artists" ? (
          <div className="grid gap-3">
            {topArtists.map((artist) => (
              <div key={artist.artistName} className="rounded-[1.2rem] border border-[var(--border)] bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold">{artist.artistName}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted">{artist.trackCount} tracks</div>
                  </div>
                  <div className="text-right text-sm text-muted">{formatSeconds(artist.secondsTotal)}</div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${percent(artist.secondsTotal, maxArtistSeconds)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "tracks" ? (
          <div className="grid gap-3 md:grid-cols-2">
            {topTracks.map((track) => (
              <article key={track.trackId} className="overflow-hidden rounded-[1.35rem] border border-[var(--border)] bg-white/[0.04]">
                <div className="grid grid-cols-[88px_1fr] gap-4 p-3">
                  <div className="relative aspect-square overflow-hidden rounded-[1rem] bg-black/[0.06]">
                    {track.coverUrl ? (
                      <img
                        src={track.coverUrl}
                        alt={`${track.trackName} cover art`}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-col justify-between py-1">
                    <div>
                      <div className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                        #{track.rank} featured track
                      </div>
                      <div className="mt-2 truncate text-lg font-semibold">{track.trackName}</div>
                      <div className="truncate text-sm text-muted">{track.artistName}</div>
                    </div>
                    <div className="mt-3">
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                        <div
                          className="h-full rounded-full bg-[#1db954]"
                          style={{ width: `${percent(track.secondsTotal, maxTrackSeconds)}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
                        {formatSeconds(track.secondsTotal)}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {tab === "genres" ? (
          <div className="grid gap-3">
            {topGenres.map((genre) => (
              <div key={genre.genre} className="rounded-[1.2rem] border border-[var(--border)] bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold">{genre.genre}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-muted">{genre.scene}</div>
                  </div>
                  <div className="text-right text-sm text-muted">{genre.count.toLocaleString()} plays</div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${percent(genre.count, maxGenreCount)}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-muted">{genre.venue}</div>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "peaks" ? (
          <div className="grid gap-3 md:grid-cols-3">
            {snapshot.peakPeriods.map((period) => (
              <div key={period.label} className="rounded-[1.35rem] border border-[var(--border)] bg-white/[0.04] p-4">
                <div className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">{period.label}</div>
                <div className="display-font mt-3 text-4xl">{period.hours}</div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${percent(period.hours, maxPeakHours)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
