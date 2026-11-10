#!/usr/bin/env python3
"""Check internal consistency of the public Spotify aggregate snapshot."""

from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT_PATH = ROOT / "frontend" / "src" / "data" / "demo.json"


def main() -> int:
    snapshot = json.loads(SNAPSHOT_PATH.read_text(encoding="utf-8"))
    facts = snapshot["listeningSnapshot"]
    years = snapshot["listeningEras"]["years"]
    year_by_number = {row["year"]: row for row in years}
    discovery = snapshot["discoveryVsComfort"]["series"]["Artists"]
    discovery_modes = snapshot["discoveryVsComfort"]["modes"]
    genres = snapshot["genreDrift"]["genres"]
    failures: list[str] = []
    passes: list[str] = []

    def check(ok: bool, label: str) -> None:
        (passes if ok else failures).append(label)

    check(len(year_by_number) == len(years), "calendar year rows are unique")
    check(all(row["hours"] >= 0 and row["artistCount"] >= 0 and row["trackCount"] >= 0 for row in years), "annual totals and counts are non-negative")
    annual_hours = sum(row["hours"] for row in years)
    check(abs(annual_hours - facts["totalHours"]) <= 0.5, "rounded annual hours reconcile to the all-time total within 0.5h")
    peak = max(years, key=lambda row: row["hours"])
    check(peak["year"] == facts["topYear"] and abs(peak["hours"] - facts["topYearHours"]) < 0.05, "all-time peak year matches the annual series")

    check(snapshot["topArtists"][0]["artistName"] == facts["topArtist"], "top artist headline matches the artist table")
    artist_hours = snapshot["topArtists"][0]["secondsTotal"] / 3600
    artist_share = round(artist_hours / facts["totalHours"] * 100, 1)
    check(abs(artist_share - facts["topArtistShare"]) <= 0.1, "top artist share reconciles to listening time")
    check(sum(row["newCount"] for row in discovery) == facts["uniqueArtists"], "first-seen artist counts reconcile to unique artists")
    check({row["year"] for row in discovery} == set(year_by_number), "artist discovery covers the same years")
    check(discovery_modes == ["Artists"] and set(snapshot["discoveryVsComfort"]["series"]) == {"Artists"}, "only the validated artist-discovery breakdown is published")

    signature = snapshot["signatureRecords"]["tracks"]
    top_tracks = snapshot["topTracks"]
    check(bool(signature) and signature[0]["trackName"] == facts["topTrack"], "featured track matches the snapshot headline")
    check(bool(top_tracks) and top_tracks[0]["trackName"] == facts["topTrack"], "featured track matches the aggregate track table")

    max_genre_share_delta = 0.0
    for genre in genres:
        for point in genre["series"]:
            denominator = year_by_number.get(point["year"], {}).get("hours", 0)
            if denominator > 0:
                max_genre_share_delta = max(
                    max_genre_share_delta,
                    abs(point["share"] - point["hours"] / denominator * 100),
                )
    # Both fields are rounded to tenths of an hour, magnifying differences in
    # low-volume years. Keep the allowance tied to that denominator.
    genre_share_ok = True
    for genre in genres:
        for point in genre["series"]:
            denominator = year_by_number.get(point["year"], {}).get("hours", 0)
            if denominator > 0:
                allowed_delta = max(0.15, 6 / denominator)
                if abs(point["share"] - point["hours"] / denominator * 100) > allowed_delta:
                    genre_share_ok = False
    check(genre_share_ok, "genre shares use annual listening hours as their denominator, within rounding precision")

    for label in passes:
        print(f"PASS  {label}")
    for label in failures:
        print(f"FAIL  {label}")
    print(f"INFO  largest genre-share rounding delta: {max_genre_share_delta:.3f} percentage points")
    print("INFO  track cards are presented as highlights; their ranking cannot be independently rebuilt from this public snapshot")
    print("INFO  raw listening rows are not read or emitted by this check")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
