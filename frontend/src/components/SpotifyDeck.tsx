"use client";

import { useMemo, useState } from "react";
import type { DiscoveryPoint, GenreSeries, PrototypePayload, SignatureTrack } from "@/data/prototype";
import { SpotifyLive } from "@/components/SpotifyLive";

const format = (value: number, digits = 0) =>
  new Intl.NumberFormat("en-GB", { maximumFractionDigits: digits }).format(value);

const hoursFromSeconds = (seconds: number) => seconds / 3600;

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

function GenreLineChart({
  genre,
  years,
}: {
  genre: GenreSeries;
  years: number[];
}) {
  const values = years.map((year) => genre.series.find((item) => item.year === year)?.share ?? 0);
  const maxValue = Math.max(...values, 1);
  const chartTop = 20;
  const chartBottom = 154;
  const chartLeft = 28;
  const chartRight = 692;
  const pointX = (index: number) => chartLeft + (index / Math.max(years.length - 1, 1)) * (chartRight - chartLeft);
  const pointY = (value: number) => chartBottom - (value / maxValue) * (chartBottom - chartTop);
  const points = values.map((value, index) => pointX(index) + "," + pointY(value)).join(" ");
  const labelYears = years.filter((_, index) => index % 2 === 0 || index === years.length - 1);

  return (
    <div className="genre-plot">
      <svg
        viewBox="0 0 720 190"
        role="img"
        aria-label={genre.genre + " share of listening by year"}
        preserveAspectRatio="none"
      >
        {[0, 0.5, 1].map((fraction) => {
          const y = chartBottom - fraction * (chartBottom - chartTop);
          const label = format(maxValue * fraction, 1) + "%";
          return (
            <g key={fraction}>
              <line x1={chartLeft} x2={chartRight} y1={y} y2={y} className="plot-grid" />
              <text x="0" y={y + 4} className="plot-axis-label">{label}</text>
            </g>
          );
        })}
        <polyline points={points} fill="none" className="genre-line" />
        {values.map((value, index) => (
          <circle
            key={years[index]}
            cx={pointX(index)}
            cy={pointY(value)}
            r="4"
            className="genre-dot"
          >
            <title>{years[index] + ": " + format(value, 1) + "%"}</title>
          </circle>
        ))}
        {labelYears.map((year) => {
          const index = years.indexOf(year);
          return (
            <text key={year} x={pointX(index)} y="181" textAnchor="middle" className="plot-year-label">
              {String(year).slice(-2)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function DiscoveryChart({
  rows,
  selectedYear,
  onSelectYear,
}: {
  rows: DiscoveryPoint[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
}) {
  const maxTotal = Math.max(...rows.map((row) => row.newCount + row.returningCount), 1);

  return (
    <div className="discovery-chart" role="group" aria-label="New and returning artists by year">
      {rows.map((row) => {
        const total = row.newCount + row.returningCount;
        const isSelected = row.year === selectedYear;
        const barWidth = (total / maxTotal) * 100;
        const newWidth = total ? (row.newCount / total) * 100 : 0;
        return (
          <button
            className={"discovery-row" + (isSelected ? " is-selected" : "")}
            key={row.year}
            type="button"
            aria-pressed={isSelected}
            aria-label={row.year + ": " + format(row.newCount) + " new artists, " + format(row.returningCount) + " returning"}
            title={row.year + " · " + format(row.newCount) + " new · " + format(row.returningCount) + " returning"}
            onClick={() => onSelectYear(row.year)}
          >
            <span className="discovery-year">{String(row.year).slice(-2)}</span>
            <span className="discovery-bar-track">
              <span className="discovery-bar" style={{ width: barWidth + "%" }}>
                <span className="discovery-new" style={{ width: newWidth + "%" }} />
                <span className="discovery-returning" style={{ width: 100 - newWidth + "%" }} />
              </span>
            </span>
            <span className="discovery-total">{format(total)}</span>
          </button>
        );
      })}
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
  const [selectedGenre, setSelectedGenre] = useState(data.genreDrift.selectedGenre);
  const year = years.find((item) => item.year === selectedYear) ?? years[0];
  const signatureTracks = data.signatureRecords.tracks;
  const featureTrack = signatureTracks[0] ?? data.signatureRecords.tracks[0];
  const selectedGenreData =
    data.genreDrift.genres.find((item) => item.genre === selectedGenre) ?? data.genreDrift.genres[0];
  const discoveryRows = data.discoveryVsComfort.series.Artists ?? [];
  const selectedDiscovery = discoveryRows.find((item) => item.year === selectedYear);
  const topArtist = data.topArtists[0];
  const maxHours = Math.max(...years.map((item) => item.hours), 1);
  const topGenres = data.genreDrift.genres;

  return (
    <main className="dashboard" id="top">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Ten Year Wrapped home">
          <span className="brand-mark">M</span>
          <span className="brand-name">MALIQUE SPOONER <small>LISTENING ARCHIVE</small></span>
        </a>
        <nav className="header-nav" aria-label="Page sections">
          <a href="#your-spotify">YOUR MUSIC</a>
          <a href="#years">THE YEARS</a>
          <a href="#shifts">THE SHIFTS</a>
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
            <a className="text-link" href="#years">Explore the archive <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-feature">
            {featureTrack ? <Cover track={featureTrack} className="hero-cover" /> : null}
            <div className="hero-feature-shade" />
            <div className="hero-feature-top"><span>ON REPEAT</span><span>NO. 01</span></div>
            <div className="hero-feature-caption">
              <span className="hero-feature-label">THE TRACK THAT STAYED</span>
              <strong>{featureTrack?.trackName ?? data.listeningSnapshot.topTrack}</strong>
              <span>{featureTrack?.artistName ?? data.listeningSnapshot.topArtist}</span>
              <span className="hero-feature-hours">
                {format(hoursFromSeconds(featureTrack?.playsOrSeconds ?? 0), 1)} <small>HRS IN ROTATION</small>
              </span>
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

        <SpotifyLive />

        <section className="overview-section" aria-labelledby="overview-title">
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
              <span className="metric-note">Most replayed: {data.listeningSnapshot.topTrack}</span>
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

        <section className="years-section" id="years" aria-labelledby="years-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE YEARS / 02</p>
              <h2 id="years-title">The soundtrack kept moving.</h2>
            </div>
            <span className="section-aside">SELECT A YEAR TO REWIND</span>
          </div>
          <div className="year-panel">
            <div className="year-focus" aria-live="polite">
              <div className="year-focus-top"><span>YEAR IN FOCUS</span><span className="year-focus-pill">{year.year === data.listeningSnapshot.topYear ? "● LISTENING PEAK" : "● YEAR SELECTED"}</span></div>
              <strong className="focus-year">{year.year}</strong>
              <p className="focus-hours">{format(year.hours, 1)} <span>hours played</span></p>
              <div className="focus-details">
                <div><span>ON REPEAT</span><strong>{year.topArtist}</strong></div>
                <div><span>TOP TRACK</span><strong>{year.topTrack}</strong></div>
                <div><span>NEW ARTISTS</span><strong>{format(year.newArtists)}</strong></div>
              </div>
            </div>
            <div className="year-chart-panel">
              <div className="chart-title-row">
                <div><span className="chart-kicker">LISTENING HOURS</span><strong>Year by year</strong></div>
                <span className="chart-unit">HOURS</span>
              </div>
              <div className="year-chart" role="group" aria-label="Select a year to view its listening details">
                {years.map((item) => {
                  const isActive = item.year === year.year;
                  const height = Math.max((item.hours / maxHours) * 100, 3);
                  return (
                    <button
                      key={item.year}
                      className={"year-point" + (isActive ? " is-active" : "")}
                      type="button"
                      aria-pressed={isActive}
                      aria-label={item.year + ": " + format(item.hours, 1) + " listening hours"}
                      title={item.year + " · " + format(item.hours, 1) + " hours"}
                      onClick={() => setSelectedYear(item.year)}
                    >
                      <span className="year-point-value">{isActive ? format(item.hours, 1) : ""}</span>
                      <span className="year-point-track"><span className="year-point-fill" style={{ height: height + "%" }} /></span>
                      <span className="year-point-label">{String(item.year).slice(-2)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="chart-axis-note"><span>2016</span><span>Tap a column to change year</span><span>2026</span></div>
            </div>
          </div>
          <div className="chapter-note">
            <span className="chapter-note-icon">↗</span>
            <p><strong>{year.year} was a {year.year === data.listeningSnapshot.topYear ? "peak" : "different"} chapter.</strong> {format(year.artistCount)} artists, {format(year.trackCount)} tracks{year.topGenre === "unknown" ? ". Genre detail is unavailable for this year." : ", with " + year.topGenre + " in the foreground."}</p>
          </div>
        </section>

        <section className="shifts-section" id="shifts" aria-labelledby="shifts-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE SHIFTS / 03</p>
              <h2 id="shifts-title">Same listener. New frequencies.</h2>
            </div>
            <span className="section-aside">TASTE CHANGES IN THE DETAILS</span>
          </div>
          <div className="insight-grid">
            <article className="insight-card genre-card">
              <div className="chart-title-row">
                <div><span className="chart-kicker">GENRE SHARE BY YEAR</span><strong>{selectedGenreData?.genre ?? "Genre"} over time</strong></div>
                <span className="mini-stat">{selectedGenreData?.peakShare.toFixed(1)}<small>% PEAK</small></span>
              </div>
              <div className="genre-select" role="group" aria-label="Choose a genre to view">
                {topGenres.map((item) => (
                  <button
                    className={"genre-chip" + (item.genre === selectedGenreData?.genre ? " is-active" : "")}
                    key={item.genre}
                    type="button"
                    aria-pressed={item.genre === selectedGenreData?.genre}
                    onClick={() => setSelectedGenre(item.genre)}
                  >
                    {item.genre}
                  </button>
                ))}
              </div>
              {selectedGenreData ? <GenreLineChart genre={selectedGenreData} years={years.map((item) => item.year)} /> : null}
              <div className="genre-foot">
                <span>FIRST APPEARED <strong>{selectedGenreData?.firstYear ?? "—"}</strong></span>
                <span>STRONGEST YEAR <strong>{selectedGenreData?.peakYear ?? "—"}</strong></span>
                <span>SCENE <strong>{selectedGenreData?.sceneLabel ?? "—"}</strong></span>
              </div>
            </article>
            <article className="insight-card discovery-card">
              <div className="chart-title-row">
                <div><span className="chart-kicker">ARTIST DISCOVERY</span><strong>New names, familiar voices</strong></div>
                <span className="mini-stat">{format(selectedDiscovery?.newCount ?? 0)}<small>NEW IN {year.year}</small></span>
              </div>
              <div className="discovery-legend">
                <span><i className="legend-swatch legend-new" />New artists</span>
                <span><i className="legend-swatch legend-returning" />Returning</span>
              </div>
              <DiscoveryChart rows={discoveryRows} selectedYear={year.year} onSelectYear={setSelectedYear} />
              <div className="discovery-foot">
                <span>ARTISTS MET FOR THE FIRST TIME</span>
                <strong>{format(selectedDiscovery?.newCount ?? 0)} <small>of {format((selectedDiscovery?.newCount ?? 0) + (selectedDiscovery?.returningCount ?? 0))}</small></strong>
              </div>
            </article>
          </div>
        </section>

        <section className="records-section" id="records" aria-labelledby="records-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE RECORDS / 04</p>
              <h2 id="records-title">The songs that stayed.</h2>
            </div>
            <span className="section-aside">MOST HOURS SPENT TOGETHER</span>
          </div>
          <div className="records-grid">
            {signatureTracks.slice(0, 8).map((track) => (
              <a
                className="record-card"
                href={"https://open.spotify.com/track/" + track.id}
                target="_blank"
                rel="noreferrer"
                key={track.id}
              >
                <div className="record-card-cover">
                  <Cover track={track} />
                  <span className="record-rank">#{String(track.rank).padStart(2, "0")}</span>
                  <span className="record-open" aria-hidden="true">↗</span>
                </div>
                <div className="record-meta">
                  <div><strong>{track.trackName}</strong><span>{track.artistName}</span></div>
                  <span className="record-hours">{format(hoursFromSeconds(track.playsOrSeconds), 1)}<small>HRS</small></span>
                </div>
              </a>
            ))}
          </div>
          <p className="records-note">Select a record to open it on Spotify.</p>
        </section>
      </div>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top"><span className="brand-mark">M</span><span className="brand-name">MALIQUE SPOONER <small>LISTENING ARCHIVE</small></span></a>
        <span>BUILT FROM A PERSONAL SPOTIFY DATA EXPORT</span>
        <a className="back-top" href="#top">BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}
