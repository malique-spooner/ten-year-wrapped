"use client";

import { useMemo, useState } from "react";
import type { PrototypePayload, SignatureTrack } from "@/data/prototype";

const lifeChapters = [
  { year: 2020, label: "Football, at its peak", title: "A title. Then the shape of life starts to change.", detail: "At Nottingham Forest, a 2020 league title was a high point in the football chapter. The years that followed brought a gradual move from playing in high-performance teams to building systems of your own.", marker: "NOTTINGHAM FOREST · LEAGUE TITLE" },
  { year: 2021, label: "A new kind of shift", title: "From the pitch to the pace of operations.", detail: "Professional football continued into 2021, alongside a new role in Amazon’s high-volume logistics operation. Teamwork, accuracy and performance under pressure carried across both environments.", marker: "FOOTBALL · AMAZON" },
  { year: 2022, label: "Learning to build", title: "The first systems were made for real work.", detail: "At WOO Architects, you began turning operational problems into tools: WOO Time, Power BI dashboards and workflow automation. Computer Science at Goldsmiths added the formal foundations.", marker: "WOO ARCHITECTS · GOLDSMITHS" },
  { year: 2023, label: "Two lives, one calendar", title: "Computer Science by day. Division I football by season.", detail: "You took your studies and football to Florida Atlantic University, balancing a full-time Computer Science course with NCAA Division I training, competition and travel. The WOO chapter ran into August.", marker: "FLORIDA ATLANTIC UNIVERSITY" },
  { year: 2024, label: "The return", title: "A chapter closes; the skills stay in play.", detail: "The FAU student-athlete chapter ran through December. Alongside the degree, it added a different kind of proof: leading in a team, adapting across cultures and sustaining several demanding commitments.", marker: "NCAA DIVISION I · COMPUTER SCIENCE" },
  { year: 2025, label: "People, culture, technology", title: "The work gets closer to the world around you.", detail: "Ada’s digital marketing and AI training added audience and storytelling to the toolkit. From June, City hospitality work brought direct experience of service, teams and nightlife environments.", marker: "ADA · CITY HOSPITALITY" },
  { year: 2026, label: "The person behind the keyboard", title: "Lived experience becomes the raw material.", detail: "With Computer Science continuing at Goldsmiths, projects such as Night Economy and this music archive bring together sport, data, software, music and hospitality into things people can actually explore.", marker: "GOLDSMITHS · PRODUCT MAKING" },
];

const youtubeEvidence: Record<number, { count: number; channels: string; signal: string; period: string }> = {
  2025: { count: 1231, channels: "Sky Sports Premier League · Sky News · Economics Explained · The B1M", signal: "Football, current affairs, economics and how things are built.", period: "13 MAY — 31 DEC" },
  2026: { count: 960, channels: "Sky Sports Premier League · Sky News · Sky Sports F1 · The B1M", signal: "Football and F1 coverage, news, explainers and building.", period: "1 JAN — 27 MAY" },
};

const format = (value: number, digits = 0) =>
  new Intl.NumberFormat("en-GB", { maximumFractionDigits: digits }).format(value);

function Cover({ track, className = "" }: { track: SignatureTrack; className?: string }) {
  return (
    <div className={"cover-art " + className}>
      {track.coverUrl ? (
        <img src={track.coverUrl} alt={track.albumName + " album artwork"} loading="lazy" />
      ) : (
        <span aria-hidden="true">{track.trackName.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}

export function SpotifyDeck({ data }: { data: PrototypePayload; dataSource: "fallback" | "api" }) {
  const years = useMemo(
    () => [...data.listeningEras.years].sort((left, right) => left.year - right.year),
    [data.listeningEras.years],
  );
  const initialYear = data.listeningSnapshot.topYear ?? years.at(-1)?.year ?? years[0]?.year ?? 2020;
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const signatureTracks = data.signatureRecords.tracks;
  const featureTrack = signatureTracks[0] ?? data.signatureRecords.tracks[0];
  const topArtist = data.topArtists[0];
  const maxHours = Math.max(...years.map((item) => item.hours), 1);
  const journeyYears = years.filter((item) => item.year >= 2020);
  const selectJourneyYear = (targetYear: number) => {
    setSelectedYear(targetYear);
    requestAnimationFrame(() => document.getElementById("journey-" + targetYear)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  return (
    <main className="dashboard" id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Ten Year Wrapped home">
          <span className="brand-mark">M</span>
          <span className="brand-name">MALIQUE SPOONER <small>LISTENING ARCHIVE</small></span>
        </a>
        <nav className="header-nav" aria-label="Page sections">
          <a href="#overview">THE ARCHIVE</a>
          <a href="#journey">THE JOURNEY</a>
          <a href="#records">THE RECORDS</a>
        </nav>
        <span className="header-date">2016 — 2026</span>
      </header>

      <div className="dashboard-content">
        <section className="hero-panel" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> TEN YEARS, IN ROTATION</p>
            <h1 id="page-title">A decade<br />in <em>sound.</em></h1>
            <p className="hero-deck">
              The songs that stayed. The years that changed. A personal soundtrack, seen all at once.
            </p>
            <a className="text-link" href="#journey">Explore the journey <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-feature">
            {featureTrack ? <Cover track={featureTrack} className="hero-cover" /> : null}
            <div className="hero-feature-shade" />
            <div className="hero-feature-top"><span>ARCHIVE HIGHLIGHT</span></div>
            <div className="hero-feature-caption">
              <span className="hero-feature-label">TRACK SPOTLIGHT</span>
              <strong>{featureTrack?.trackName ?? data.listeningSnapshot.topTrack}</strong>
              <span>{featureTrack?.artistName ?? data.listeningSnapshot.topArtist}</span>
            </div>
            {featureTrack?.id ? (
              <a
                className="hero-cover-link"
                href={"https://open.spotify.com/track/" + featureTrack.id}
                target="_blank"
                rel="noreferrer"
                aria-label={"Open " + featureTrack.trackName + " on Spotify"}
              >
                ↗
              </a>
            ) : null}
          </div>
          <div className="hero-footnote">
            <span>A PERSONAL MUSIC ARCHIVE</span>
            <span>01 / 04</span>
          </div>
        </section>

        <section className="overview-section" id="overview" aria-labelledby="overview-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE BIG PICTURE / 01</p>
              <h2 id="overview-title">Your archive, at a glance.</h2>
            </div>
            <span className="section-aside">ONE PERSON. 11 YEARS OF LISTENING.</span>
          </div>
          <div className="metric-grid">
            <article className="metric-card metric-primary">
              <span className="metric-label">TIME IN THE HEADPHONES</span>
              <strong>{format(data.listeningSnapshot.totalHours, 1)}<small> hrs</small></strong>
            <span className="metric-note">Nearly 220 full days of music.</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">ARTISTS</span>
              <strong>{format(data.listeningSnapshot.uniqueArtists)}</strong>
              <span className="metric-note">Top artist: {data.listeningSnapshot.topArtist}</span>
            </article>
            <article className="metric-card">
              <span className="metric-label">TRACKS</span>
              <strong>{format(data.listeningSnapshot.uniqueTracks)}</strong>
              <span className="metric-note">Track spotlight: {data.listeningSnapshot.topTrack}</span>
            </article>
            <article className="metric-card metric-peak">
              <span className="metric-label">THE LOUDEST YEAR</span>
              <strong>{data.listeningSnapshot.topYear}</strong>
              <span className="metric-note">{format(data.listeningSnapshot.topYearHours, 1)} listening hours</span>
            </article>
          </div>
          <div className="story-ribbon">
            <span className="ribbon-index">01</span>
            <p><strong>{topArtist?.artistName ?? data.listeningSnapshot.topArtist}</strong> led the archive with {format(data.listeningSnapshot.topArtistShare, 1)}% of listening time; {data.listeningSnapshot.topGenre} gave it its strongest genre signature.</p>
            <span className="ribbon-mark" aria-hidden="true">✳</span>
          </div>
        </section>

        <section className="life-section" id="journey" aria-labelledby="life-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE JOURNEY / 02</p>
              <h2 id="life-title">A life, heard and seen.</h2>
            </div>
            <span className="section-aside">CV + SPOTIFY · 2020—NOW / YOUTUBE · MAY 2025—MAY 2026</span>
          </div>
          <div className="journey-chart-panel">
            <div className="chart-title-row">
              <div><span className="chart-kicker">THE SOUNDTRACK, YEAR BY YEAR</span><strong>Choose a year to jump into its chapter</strong></div>
              <span className="chart-unit">SPOTIFY</span>
            </div>
            <div className="year-chart journey-chart" role="group" aria-label="Choose a year in the life journey">
              {journeyYears.map((item) => {
                const isActive = item.year === selectedYear;
                const height = Math.max((item.hours / maxHours) * 100, 3);
                return (
                  <button key={item.year} className={"year-point" + (isActive ? " is-active" : "")} type="button"
                    aria-pressed={isActive} aria-label={item.year + ": " + format(item.hours, 1) + " listening hours"}
                    title={item.year + " · " + format(item.hours, 1) + " hours"} onClick={() => selectJourneyYear(item.year)}>
                    <span className="year-point-value">{format(item.hours, 1)}</span>
                    <span className="year-point-track"><span className="year-point-fill" style={{ height: height + "%" }} /></span>
                    <span className="year-point-label">{item.year}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="journey-timeline">
            {lifeChapters.map((chapter) => {
              const music = years.find((item) => item.year === chapter.year);
              const youtube = youtubeEvidence[chapter.year];
              const artistDiscovery = data.discoveryVsComfort.series.Artists?.find((item) => item.year === chapter.year);
              return (
                <article className={"journey-chapter" + (chapter.year === selectedYear ? " is-selected" : "")} id={"journey-" + chapter.year} key={chapter.year}>
                  <div className="journey-year-rail"><strong>{chapter.year}</strong><span>{chapter.label}</span></div>
                  <div className="journey-chapter-body">
                    <div className="journey-heading-row"><span className="life-marker">{chapter.marker}</span><span className="journey-chapter-index">CHAPTER {String(chapter.year).slice(-2)}</span></div>
                    <h3>{chapter.title}</h3>
                    <p className="journey-description">{chapter.detail}</p>
                    <div className={"journey-evidence" + (!youtube ? " is-single" : "")}>
                      {music ? <div className="journey-evidence-card spotify-proof">
                        <span className="chart-kicker">SPOTIFY · PERSONAL LISTENING ARCHIVE</span>
                        <strong className="journey-proof-stat">{format(music.hours, 1)}<small> HRS</small></strong>
                        <span><b>{music.topArtist}</b> on repeat</span>
                        <span className="journey-track">“{music.topTrack}” was the year’s top track</span>
                        {artistDiscovery ? <span className="journey-track">{format(artistDiscovery.newCount)} artists first appeared in this Spotify export</span> : null}
                      </div> : null}
                      {youtube ? <div className="journey-evidence-card youtube-proof">
                        <span className="chart-kicker">YOUTUBE · SAVED ACTIVITY</span>
                        <strong className="journey-proof-stat">{format(youtube.count)}<small> WATCH EVENTS</small></strong>
                        <span className="youtube-period">{youtube.period} · NON-AD WATCH HISTORY</span>
                        <span>{youtube.signal}</span>
                        <span className="journey-track">Recurring channels: {youtube.channels}</span>
                      </div> : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="life-footnote">CV and portfolio records establish the career dates. Spotify shows listening in the same calendar year. The YouTube figures come from the Takeout archive currently on hand (13 May 2025–27 May 2026); they show recorded viewing interests, not proof of a career event. Coverage of both Google accounts has not been confirmed, and 2026 is partial.</p>
        </section>

        <section className="records-section" id="records" aria-labelledby="records-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE RECORDS / 03</p>
              <h2 id="records-title">The songs that stayed.</h2>
            </div>
            <span className="section-aside">FEATURED TRACKS FROM THE ARCHIVE</span>
          </div>
          <div className="records-grid">
            {signatureTracks.slice(0, 8).map((track) => (
              <a
                className="record-card"
                href={"https://open.spotify.com/track/" + track.id}
                target="_blank"
                rel="noreferrer"
                key={track.id}
                aria-label={"Open " + track.trackName + " by " + track.artistName + " on Spotify (opens in a new tab)"}
              >
                <div className="record-card-cover">
                  <Cover track={track} />
                  <span className="record-open" aria-hidden="true">↗</span>
                </div>
                <div className="record-meta">
                  <div><strong>{track.trackName}</strong><span>{track.artistName}</span></div>
                </div>
              </a>
            ))}
          </div>
          <p className="records-note">Select a record to open it on Spotify.</p>
        </section>

        <section className="methodology-section" aria-labelledby="methodology-title">
          <details className="methodology-details">
            <summary><span><small>DATA NOTES</small><strong id="methodology-title">How this story is counted</strong></span><span className="methodology-toggle" aria-hidden="true">+</span></summary>
            <div className="methodology-copy">
              <p><strong>Source and coverage.</strong> Spotify listening comes from an Extended Streaming History export covering 27 January 2016 to 17 May 2026. YouTube watch history currently covers 13 May 2025 to 27 May 2026. The timeline pairs records from the same calendar year where both are available; it does not claim the media caused or verified a career event.</p>
              <p><strong>Listening time.</strong> Logged music-play duration is summed from milliseconds and converted to hours. Annual totals are rounded separately to one decimal place, so their visible sum can differ slightly from the all-time total.</p>
              <p><strong>Artists and tracks.</strong> Counts use the prepared snapshot’s canonical identities. Spotify recording IDs and grouping by track, artist and album can produce different totals for reissues, alternate versions and collaborations.</p>
              <p><strong>First-seen artists.</strong> “First appeared in this export” means the artist is absent from earlier years in the available Spotify data. It does not mean this was the first time you ever listened to them.</p>
              <p><strong>Genres and track highlights.</strong> Genre labels are artist-level enrichment, not fields in the listening events; tags can overlap, so their yearly shares are not exclusive. Featured tracks are story highlights, not a verified all-time ranking.</p>
              <p><strong>YouTube coverage.</strong> The current local Takeout does not confirm whether both Google accounts are included. The site only shows YouTube figures for dates present in that archive; 2026 is partial.</p>
              <p><strong>Privacy.</strong> Only aggregate music and viewing figures are included in this public site. Raw listening and watch history, and the source CV documents, remain local.</p>
            </div>
          </details>
        </section>
      </div>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top"><span className="brand-mark">M</span><span className="brand-name">MALIQUE SPOONER <small>LISTENING ARCHIVE</small></span></a>
        <span>CAREER MILESTONES × PERSONAL MEDIA ARCHIVE</span>
        <a className="back-top" href="#top">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
