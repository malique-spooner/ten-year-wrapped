"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  connectSpotify, disconnectSpotify, finishSpotifyConnection, isSpotifyConnected,
  spotifyRequest, type Playing, type SpotifyAlbum, type SpotifyPage, type SpotifyPlaylist, type SpotifyTrack,
} from "@/lib/spotify";

type Tab = "tracks" | "albums" | "playlists";
type SavedTrack = { added_at: string; track: SpotifyTrack };
type SavedAlbum = { added_at: string; album: SpotifyAlbum };

function Artwork({ src, label }: { src?: string; label: string }) {
  return src ? <img className="spotify-live-art" src={src} alt={label + " cover"} loading="lazy" /> : <div className="spotify-live-art spotify-art-empty" aria-hidden="true">♪</div>;
}

function trackArtist(track: SpotifyTrack) { return track.artists?.map((artist) => artist.name).join(", ") || "Unknown artist"; }

export function SpotifyLive() {
  const [connected, setConnected] = useState(false);
  const [playing, setPlaying] = useState<Playing>(null);
  const [tab, setTab] = useState<Tab>("tracks");
  const [tracks, setTracks] = useState<SavedTrack[]>([]);
  const [albums, setAlbums] = useState<SavedAlbum[]>([]);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [totals, setTotals] = useState({ tracks: 0, albums: 0, playlists: 0 });
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadLibrary = useCallback(async (kind: Tab, next?: string | null) => {
    setBusy(true);
    setError("");
    try {
      const endpoint = next || ({ tracks: "/me/tracks?limit=50", albums: "/me/albums?limit=50", playlists: "/me/playlists?limit=50" } as const)[kind];
      const page = await spotifyRequest<SpotifyPage<SavedTrack | SavedAlbum | SpotifyPlaylist>>(endpoint);
      if (kind === "tracks") {
        const rows = page.items as SavedTrack[];
        setTracks((current) => next ? [...current, ...rows] : rows);
      } else if (kind === "albums") {
        const rows = page.items as SavedAlbum[];
        setAlbums((current) => next ? [...current, ...rows] : rows);
      } else {
        const rows = page.items as SpotifyPlaylist[];
        setPlaylists((current) => next ? [...current, ...rows] : rows);
      }
      setTotals((current) => ({ ...current, [kind]: page.total }));
      setNextUrl(page.next);
      setLastUpdated(new Date());
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load Spotify library."); }
    finally { setBusy(false); }
  }, []);

  const refreshPlaying = useCallback(async () => {
    try { setPlaying(await spotifyRequest<Playing>("/me/player/currently-playing")); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load playback."); }
  }, []);

  useEffect(() => {
    let active = true;
    const finish = async () => {
      const result = await finishSpotifyConnection();
      if (active && result && result !== "connected") setError(result);
      if (active) setConnected(isSpotifyConnected());
    };
    void finish();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!connected) return;
    void loadLibrary(tab);
    void refreshPlaying();
    const timer = window.setInterval(() => { void refreshPlaying(); }, 30_000);
    return () => window.clearInterval(timer);
  }, [connected, tab, loadLibrary, refreshPlaying]);

  const visibleRows = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (tab === "tracks") return tracks.filter(({ track }) => !needle || (track.name + " " + trackArtist(track) + " " + track.album.name).toLocaleLowerCase().includes(needle));
    if (tab === "albums") return albums.filter(({ album }) => !needle || (album.name + " " + album.artists.map((artist) => artist.name).join(" ")).toLocaleLowerCase().includes(needle));
    return playlists.filter((playlist) => !needle || playlist.name.toLocaleLowerCase().includes(needle));
  }, [albums, playlists, query, tab, tracks]);

  function chooseTab(next: Tab) {
    setTab(next);
    setNextUrl(null);
    setQuery("");
  }

  function disconnect() {
    disconnectSpotify();
    setConnected(false);
    setPlaying(null);
    setTracks([]); setAlbums([]); setPlaylists([]);
    setError(""); setLastUpdated(null);
  }

  const currentTrack = playing?.item;
  const currentCover = currentTrack?.album?.images?.[0]?.url;
  const count = totals[tab];

  return (
    <section className="spotify-live-section" id="your-spotify" aria-labelledby="spotify-live-title">
      <div className="spotify-live-heading">
        <div>
          <p className="eyebrow"><span className="eyebrow-dot" /> SPOTIFY / LIVE CONNECTION</p>
          <h2 id="spotify-live-title">Your music,<br /><em>right now.</em></h2>
        </div>
        <span className="spotify-live-caption">YOUR LIBRARY · CURRENTLY PLAYING</span>
      </div>

      {!connected ? (
        <div className="spotify-connect-card">
          <div className="spotify-connect-orbit" aria-hidden="true"><span>♪</span></div>
          <div className="spotify-connect-copy">
            <span className="spotify-live-overline">A LIVE WINDOW INTO YOUR LISTENING</span>
            <h3>Open your Spotify world.</h3>
            <p>Connect to bring your saved tracks, albums and playlists into this archive. Your connection stays on this device and can be removed any time.</p>
            <button className="spotify-connect-button" type="button" onClick={() => void connectSpotify()}>Connect Spotify <span aria-hidden="true">↗</span></button>
          </div>
          <div className="spotify-connect-art-stack" aria-hidden="true"><span>01</span><span>02</span><span>03</span></div>
        </div>
      ) : (
        <>
          <div className="spotify-now-card" aria-live="polite">
            <div className="spotify-now-art-wrap"><Artwork src={currentCover} label={currentTrack?.album?.name || "Spotify"} /><span className="spotify-now-equalizer" aria-label={playing?.is_playing ? "Playing now" : "Paused"}><i /><i /><i /><i /></span></div>
            <div className="spotify-now-copy">
              <span className="spotify-live-overline"><span className={playing?.is_playing ? "spotify-live-dot is-on" : "spotify-live-dot"} /> {playing?.is_playing ? "PLAYING ON SPOTIFY" : "YOUR SPOTIFY, RIGHT NOW"}</span>
              {currentTrack ? <><h3>{currentTrack.name}</h3><p>{trackArtist(currentTrack)} <span>·</span> {currentTrack.album.name}</p></> : <><h3>Nothing playing.</h3><p>When Spotify starts, the moment will appear here.</p></>}
            </div>
            {currentTrack?.external_urls?.spotify ? <a className="spotify-open-link" href={currentTrack.external_urls.spotify} target="_blank" rel="noreferrer" aria-label="Open current track in Spotify">↗</a> : null}
            <div className="spotify-now-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          </div>

          <div className="spotify-library-shell">
            <div className="spotify-library-head">
              <div><span className="spotify-live-overline">THE COLLECTION</span><h3>Your library <small>{count ? count.toLocaleString("en-GB") : ""}</small></h3></div>
              <div className="spotify-library-controls">
                <label className="spotify-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a favourite" aria-label="Search your Spotify library" /></label>
                <button type="button" className="spotify-refresh" onClick={() => { void loadLibrary(tab); void refreshPlaying(); }} disabled={busy} aria-label="Refresh Spotify data">↻</button>
              </div>
            </div>
            <div className="spotify-library-tabs" role="tablist" aria-label="Spotify library type">
              {([ ["tracks", "Liked songs"], ["albums", "Albums"], ["playlists", "Playlists"] ] as const).map(([id, label]) => <button type="button" role="tab" aria-selected={tab === id} className={tab === id ? "is-active" : ""} key={id} onClick={() => chooseTab(id)}>{label}<span>{totals[id] ? totals[id].toLocaleString("en-GB") : "—"}</span></button>)}
            </div>
            {error ? <p className="spotify-live-error" role="status">{error}</p> : null}
            {busy && visibleRows.length === 0 ? <div className="spotify-library-empty">Opening your collection…</div> : visibleRows.length ? (
              <div className={tab === "tracks" ? "spotify-library-list" : "spotify-library-grid"}>
                {tab === "tracks" ? (visibleRows as SavedTrack[]).map(({ track }, index) => <a className="spotify-track-row" href={track.external_urls?.spotify || "https://open.spotify.com"} target="_blank" rel="noreferrer" key={track.id + index}><Artwork src={track.album.images?.[2]?.url || track.album.images?.[0]?.url} label={track.album.name} /><span className="spotify-row-index">{String(index + 1).padStart(2, "0")}</span><span className="spotify-row-title"><strong>{track.name}</strong><small>{trackArtist(track)}</small></span><span className="spotify-row-album">{track.album.name}</span><span className="spotify-row-open">↗</span></a>) : null}
                {tab === "albums" ? (visibleRows as SavedAlbum[]).map(({ album }, index) => <a className="spotify-library-tile" href={album.external_urls?.spotify || "https://open.spotify.com"} target="_blank" rel="noreferrer" key={album.id + index}><Artwork src={album.images?.[0]?.url} label={album.name} /><strong>{album.name}</strong><span>{album.artists.map((artist) => artist.name).join(", ")}</span><small>ALBUM</small></a>) : null}
                {tab === "playlists" ? (visibleRows as SpotifyPlaylist[]).map((playlist, index) => <a className="spotify-library-tile" href={playlist.external_urls?.spotify || "https://open.spotify.com"} target="_blank" rel="noreferrer" key={playlist.id + index}><Artwork src={playlist.images?.[0]?.url} label={playlist.name} /><strong>{playlist.name}</strong><span>{playlist.tracks?.total?.toLocaleString("en-GB") || 0} tracks · {playlist.owner?.display_name || "Your Spotify"}</span><small>PLAYLIST</small></a>) : null}
              </div>
            ) : <div className="spotify-library-empty">{query ? "No matches in this part of your library." : "This shelf is waiting for its first record."}</div>}
            {nextUrl ? <button className="spotify-load-more" type="button" disabled={busy} onClick={() => void loadLibrary(tab, nextUrl)}>{busy ? "Loading…" : "Load more from your library"} <span>↓</span></button> : null}
            <div className="spotify-library-foot"><span>{lastUpdated ? "UPDATED " + lastUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "LIVE FROM SPOTIFY"}</span><button type="button" onClick={disconnect}>Disconnect Spotify</button></div>
          </div>
        </>
      )}
    </section>
  );
}
