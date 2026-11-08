export const heroChips = [
  "Taste profile",
  "Scene mapping",
  "Venue ideas",
  "Dance pathways",
  "Python backend",
];

export const summaryStats = [
  { label: "Representative artists", value: "18", detail: "curated from the export" },
  { label: "Scene matches", value: "6", detail: "high-confidence targets" },
  { label: "Dance routes", value: "4", detail: "beginner-friendly starting points" },
  { label: "Going-out fit", value: "82", detail: "signal strength score" },
];

export const tasteSignals = [
  {
    title: "Rhythm",
    body: "You lean toward groove-heavy music with movement and pulse, not just chart popularity.",
  },
  {
    title: "Mood",
    body: "Warm, late-night, and social textures show up more strongly than aggressive club energy.",
  },
  {
    title: "Identity",
    body: "A few artists act as scene anchors, while others are more private-listen comfort signals.",
  },
];

export const sceneMatches = [
  {
    name: "Afrobeats lounge",
    fit: 96,
    venue: "DJ-led lounge or listening bar",
    dance: "afrobeats groove basics",
  },
  {
    name: "Amapiano night",
    fit: 92,
    venue: "club room with deep groove",
    dance: "bounce, shuffles, pocketed footwork",
  },
  {
    name: "House-forward set",
    fit: 88,
    venue: "dance floor or underground club",
    dance: "house foundation steps",
  },
  {
    name: "R&B social night",
    fit: 84,
    venue: "intimate bar or lounge",
    dance: "slow groove partner basics",
  },
];

export const dancePathways = [
  {
    title: "Start with groove",
    body: "Learn one foundational groove that helps you join the room quickly without overthinking.",
  },
  {
    title: "Add partner basics",
    body: "If your strongest scenes are social or Latin-adjacent, add one partner pattern next.",
  },
  {
    title: "Stay scene-specific",
    body: "Each dance suggestion should map to a scene you actually want to attend, not a generic list.",
  },
];

export type MetricStat = {
  label: string;
  value: string;
  detail: string;
};

export type TasteSignal = {
  title: string;
  body: string;
};

export type SceneMatch = {
  name: string;
  fit: number;
  venue: string;
  dance: string;
};

export type DancePathway = {
  title: string;
  body: string;
};

export type TopArtist = {
  artistName: string;
  secondsTotal: number;
  trackCount: number;
};

export type TopGenre = {
  genre: string;
  count: number;
  scene: string;
  venue: string;
};

export type TopTrack = {
  rank: number;
  trackId: string;
  trackName: string;
  artistName: string;
  secondsTotal: number;
  coverUrl?: string | null;
  albumName?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
};


export type HeroStory = {
  id: string;
  order: number;
  eyebrow: string;
  title: string;
  statLabel: string;
  statValue: string;
  body: string;
  coverUrl?: string | null;
  coverTitle: string;
  coverArtist: string;
};

export type GlanceTile = {
  label: string;
  value: string;
  detail: string;
  expanded: Array<{
    label: string;
    value: string;
  }>;
};

export type EraPoint = {
  year: number;
  hours: number;
  topArtist: string;
  topTrack: string;
  topGenre: string;
  discoveryRate: number;
  eraLabel: string;
  artistCount: number;
  trackCount: number;
  newArtists: number;
  topArtistShare: number;
  topTrackShare: number;
};

export type LoyaltyRow = {
  artistName: string;
  secondsTotal: number;
  activeYears: number;
  peakYear: number;
  peakYearSeconds: number;
  share: number;
  loyaltyScore: number;
  yearPresence: number[];
  yearSpan: number;
  peakYearShare: number;
};

export type LoyaltyPayload = {
  modes: string[];
  selectedMode: string;
  rows: LoyaltyRow[];
  rankings: Record<string, LoyaltyRow[]>;
  yearColumns: number[];
  detail: {
    selectedArtist: string;
  };
};

export type ObsessionWindow = {
  id: string;
  windowLabel: string;
  plays: number;
  secondsTotal: number;
  share: number;
  trackName: string;
  artistName: string;
  peakMonth: string;
  monthShare: number;
  peakMonthPlays: number;
};

export type ObsessionPayload = {
  modes: string[];
  selectedMode: string;
  windows: Record<string, ObsessionWindow[]>;
};

export type DiscoveryModeRow = {
  year: number;
  newCount: number;
  returningCount: number;
};

export type DiscoveryPayload = {
  selectedMode: string;
  modes: string[];
  series: Record<string, DiscoveryModeRow[]>;
};

export type GenreDriftRow = {
  year: number;
  hours: number;
  share: number;
};

export type GenreDriftGenre = {
  genre: string;
  sceneLabel: string;
  firstYear: number | null;
  peakYear: number | null;
  peakShare: number;
  relatedTopArtists: string[];
  series: GenreDriftRow[];
};

export type GenreDriftPayload = {
  selectedGenre: string;
  genres: GenreDriftGenre[];
};

export type SignatureTile = {
  id: string;
  rank: number;
  trackName: string;
  artistName: string;
  playsOrSeconds: number;
  coverUrl?: string | null;
  albumName?: string | null;
  kind: "track" | "artist" | "album" | "moment";
};

export type SignatureRecordsPayload = {
  selectedTab: string;
  tabs: string[];
  tracks: SignatureTile[];
  artists: SignatureTile[];
  albums: SignatureTile[];
  moments: SignatureTile[];
};


export type ListeningSnapshot = {
  totalHours: number;
  uniqueArtists: number;
  uniqueTracks: number;
  topArtist: string;
  topTrack: string;
  topGenre: string;
  topArtistShare: number;
  topTrackShare: number;
  topMonth: string;
  topMonthHours: number;
  topYear?: number | null;
  topYearHours: number;
  peakPeriods: Array<{
    label: string;
    hours: number;
  }>;
};

export type InsightStory = {
  headline: string;
  subheadline: string;
  highlights: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
  takeaways: Array<{
    label: string;
    text: string;
  }>;
  signatureTracks: TopTrack[];
};

export type PrototypePayload = {
  generatedAt?: string;
  spotifyConfigured?: boolean;
  genreCoveragePct?: number;
  heroChips: string[];
  heroStories: HeroStory[];
  atAGlance: GlanceTile[];
  listeningEras: {
    selectedYear?: number | null;
    years: EraPoint[];
  };
  artistLoyalty: LoyaltyPayload;
  obsessionIndex: ObsessionPayload;
  discoveryVsComfort: DiscoveryPayload;
  genreDrift: GenreDriftPayload;
  signatureRecords: SignatureRecordsPayload;
  listeningSnapshot?: ListeningSnapshot;
  summaryStats: MetricStat[];
  insightStory: InsightStory;
  tasteSignals: TasteSignal[];
  sceneMatches: SceneMatch[];
  dancePathways: DancePathway[];
  topArtists: TopArtist[];
  topGenres: TopGenre[];
  topTracks: TopTrack[];
};

export const prototypeFallback: PrototypePayload = {
  spotifyConfigured: false,
  genreCoveragePct: 100,
  heroChips,
  heroStories: [
    {
      id: "decade-artist",
      order: 1,
      eyebrow: "Decade artist",
      title: "The artist who owned your decade",
      statLabel: "Artist",
      statValue: "Eminem",
      body: "Eminem carries the clearest identity weight in the fallback story.",
      coverUrl: null,
      coverTitle: "Eminem",
      coverArtist: "Eminem",
    },
    {
      id: "signature-song",
      order: 2,
      eyebrow: "Signature song",
      title: "The track you kept returning to",
      statLabel: "Track",
      statValue: "Closure",
      body: "Closure is the fallback song anchor for the decade cover.",
      coverUrl: null,
      coverTitle: "Closure",
      coverArtist: "Cadet",
    },
    {
      id: "biggest-year",
      order: 3,
      eyebrow: "Biggest year",
      title: "Your loudest year: 2020",
      statLabel: "Hours",
      statValue: "949.5",
      body: "2020 concentrated the most listening time in the fallback story.",
      coverUrl: null,
      coverTitle: "Biggest year",
      coverArtist: "Eminem",
    },
    {
      id: "biggest-obsession",
      order: 4,
      eyebrow: "Biggest obsession",
      title: "The phase that defined the archive",
      statLabel: "Month",
      statValue: "2021-03",
      body: "March 2021 was the strongest listening phase in the fallback deck.",
      coverUrl: null,
      coverTitle: "Biggest obsession",
      coverArtist: "Cadet",
    },
    {
      id: "listening-type",
      order: 5,
      eyebrow: "Listening type",
      title: "The kind of listener this export describes",
      statLabel: "Scene",
      statValue: "Hip-hop party",
      body: "The fallback taste profile maps to a hip-hop party lane.",
      coverUrl: null,
      coverTitle: "Listening type",
      coverArtist: "Hip-hop party",
    },
  ],
  atAGlance: [
    {
      label: "Total listening hours",
      value: "4801.3",
      detail: "music listening hours",
      expanded: [
        { label: "Top month", value: "2021-03" },
        { label: "Top year", value: "2020" },
      ],
    },
    {
      label: "Total plays",
      value: "38,420",
      detail: "music play events",
      expanded: [
        { label: "30s-valid plays", value: "38,420" },
        { label: "Peak window", value: "2021-03" },
      ],
    },
    {
      label: "Unique tracks",
      value: "13,816",
      detail: "distinct songs in the export",
      expanded: [
        { label: "Top track", value: "Closure" },
        { label: "Top track share", value: "0.8%" },
      ],
    },
    {
      label: "Unique artists",
      value: "3,572",
      detail: "distinct artists in the export",
      expanded: [
        { label: "Top artist", value: "Eminem" },
        { label: "Top artist share", value: "6.7%" },
      ],
    },
    {
      label: "Top artist",
      value: "Eminem",
      detail: "single strongest artist",
      expanded: [
        { label: "Hours", value: "321.1" },
        { label: "Tracks", value: "434" },
      ],
    },
    {
      label: "Top track",
      value: "Closure",
      detail: "single strongest track",
      expanded: [
        { label: "Hours", value: "37.2" },
        { label: "Album", value: "Closure" },
      ],
    },
  ],
  listeningEras: {
    selectedYear: 2020,
    years: [
      {
        year: 2024,
        hours: 117.4,
        topArtist: "Dave",
        topTrack: "How I Met My Ex",
        topGenre: "grime",
        discoveryRate: 26.4,
        eraLabel: "Rap-heavy year",
        artistCount: 612,
        trackCount: 2110,
        newArtists: 161,
        topArtistShare: 13.2,
        topTrackShare: 1.1,
      },
      {
        year: 2023,
        hours: 114.9,
        topArtist: "SL",
        topTrack: "Mad About Africa - Pt. 2",
        topGenre: "uk drill",
        discoveryRate: 24.8,
        eraLabel: "Rap-heavy year",
        artistCount: 598,
        trackCount: 2043,
        newArtists: 148,
        topArtistShare: 12.6,
        topTrackShare: 1.0,
      },
      {
        year: 2022,
        hours: 130.9,
        topArtist: "Eminem",
        topTrack: "Closure",
        topGenre: "grime",
        discoveryRate: 19.4,
        eraLabel: "Artist-led year",
        artistCount: 542,
        trackCount: 1920,
        newArtists: 105,
        topArtistShare: 16.5,
        topTrackShare: 1.3,
      },
      {
        year: 2021,
        hours: 949.5,
        topArtist: "Eminem",
        topTrack: "Closure",
        topGenre: "grime",
        discoveryRate: 15.2,
        eraLabel: "Artist-led year",
        artistCount: 478,
        trackCount: 1814,
        newArtists: 73,
        topArtistShare: 21.1,
        topTrackShare: 2.2,
      },
      {
        year: 2020,
        hours: 949.5,
        topArtist: "Eminem",
        topTrack: "Closure",
        topGenre: "grime",
        discoveryRate: 15.2,
        eraLabel: "Artist-led year",
        artistCount: 478,
        trackCount: 1814,
        newArtists: 73,
        topArtistShare: 21.1,
        topTrackShare: 2.2,
      },
    ],
  },
  artistLoyalty: {
    modes: ["Most Hours", "Most Loyal", "Biggest Peak"],
    selectedMode: "Most Hours",
    rows: [
      {
        artistName: "Eminem",
        secondsTotal: 1155925.7,
        activeYears: 8,
        peakYear: 2020,
        peakYearSeconds: 198000,
        share: 6.7,
        loyaltyScore: 86.2,
        yearPresence: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2024],
        yearSpan: 9,
        peakYearShare: 17.1,
      },
      {
        artistName: "Dave",
        secondsTotal: 585649.88,
        activeYears: 6,
        peakYear: 2024,
        peakYearSeconds: 144000,
        share: 3.4,
        loyaltyScore: 78.1,
        yearPresence: [2019, 2020, 2021, 2022, 2023, 2024],
        yearSpan: 6,
        peakYearShare: 24.6,
      },
      {
        artistName: "SL",
        secondsTotal: 572639.96,
        activeYears: 5,
        peakYear: 2023,
        peakYearSeconds: 138000,
        share: 3.3,
        loyaltyScore: 74.2,
        yearPresence: [2019, 2020, 2021, 2022, 2023],
        yearSpan: 5,
        peakYearShare: 24.1,
      },
    ],
    rankings: {
      "Most Hours": [],
      "Most Loyal": [],
      "Biggest Peak": [],
    },
    yearColumns: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
    detail: { selectedArtist: "Eminem" },
  },
  obsessionIndex: {
    modes: ["Week", "Month", "Year"],
    selectedMode: "Month",
    windows: {
      Month: [
        {
          id: "month::2021-03::0lDBLaFI3vjLBQG8suphln",
          windowLabel: "2021-03",
          plays: 84,
          secondsTotal: 134090.42,
          share: 18.2,
          trackName: "Closure",
          artistName: "Cadet",
          peakMonth: "2021-03",
          monthShare: 42.1,
          peakMonthPlays: 84,
        },
      ],
      Week: [],
      Year: [],
    },
  },
  discoveryVsComfort: {
    selectedMode: "Artists",
    modes: ["Artists", "Tracks", "Genres"],
    series: {
      Artists: [
        { year: 2020, newCount: 105, returningCount: 373 },
        { year: 2021, newCount: 73, returningCount: 405 },
        { year: 2022, newCount: 88, returningCount: 454 },
      ],
      Tracks: [
        { year: 2020, newCount: 281, returningCount: 1298 },
        { year: 2021, newCount: 241, returningCount: 1371 },
        { year: 2022, newCount: 265, returningCount: 1518 },
      ],
      Genres: [
        { year: 2020, newCount: 7, returningCount: 15 },
        { year: 2021, newCount: 6, returningCount: 14 },
        { year: 2022, newCount: 5, returningCount: 14 },
      ],
    },
  },
  genreDrift: {
    selectedGenre: "grime",
    genres: [
      {
        genre: "grime",
        sceneLabel: "Hip-hop party",
        firstYear: 2016,
        peakYear: 2020,
        peakShare: 28.2,
        relatedTopArtists: ["Eminem", "Dave", "SL"],
        series: [
          { year: 2020, hours: 322.1, share: 28.2 },
          { year: 2021, hours: 311.8, share: 26.1 },
          { year: 2022, hours: 298.4, share: 24.7 },
        ],
      },
    ],
  },
  signatureRecords: {
    selectedTab: "Tracks",
    tabs: ["Tracks", "Artists", "Albums", "Moments"],
    tracks: [
      {
        id: "0lDBLaFI3vjLBQG8suphln",
        rank: 1,
        trackName: "Closure",
        artistName: "Cadet",
        playsOrSeconds: 134090.42,
        coverUrl: null,
        albumName: "Closure",
        kind: "track",
      },
      {
        id: "2nO7YG8CFXSZOpvxSFUzgJ",
        rank: 2,
        trackName: "How I Met My Ex",
        artistName: "Dave",
        playsOrSeconds: 108167.61,
        coverUrl: null,
        albumName: "Game Over",
        kind: "track",
      },
    ],
    artists: [
      {
        id: "Eminem",
        rank: 1,
        trackName: "Eminem",
        artistName: "Eminem",
        playsOrSeconds: 1155925.7,
        coverUrl: null,
        albumName: "Artist",
        kind: "artist",
      },
    ],
    albums: [
      {
        id: "Closure",
        rank: 1,
        trackName: "Closure",
        artistName: "Cadet",
        playsOrSeconds: 134090.42,
        coverUrl: null,
        albumName: "Closure",
        kind: "album",
      },
    ],
    moments: [
      {
        id: "moment::2021-03::0lDBLaFI3vjLBQG8suphln",
        rank: 1,
        trackName: "Closure",
        artistName: "Cadet",
        playsOrSeconds: 134090.42,
        coverUrl: null,
        albumName: "2021-03",
        kind: "moment",
      },
    ],
  },
  summaryStats,
  listeningSnapshot: {
    totalHours: 0,
    uniqueArtists: 0,
    uniqueTracks: 0,
    topArtist: "Eminem",
    topTrack: "Closure",
    topGenre: "grime",
    topArtistShare: 0,
    topTrackShare: 0,
    topMonth: "2016-01",
    topMonthHours: 0,
    topYear: 2016,
    topYearHours: 0,
    peakPeriods: [],
  },
  insightStory: {
    headline: "A concentrated, scene-aware profile with a clear listening core.",
    subheadline: "The story still works from the export alone because it already shows strong identity and repetition.",
    highlights: [
      { label: "Top artist share", value: "31%", detail: "portion of total listening held by the single biggest artist" },
      { label: "Top track share", value: "4%", detail: "portion of total listening held by the single biggest track" },
      { label: "Top artist", value: "Eminem", detail: "most defining artist in the current export" },
      { label: "Top track", value: "Closure", detail: "most defining track in the current export" },
    ],
    takeaways: [
      {
        label: "Taste shape",
        text: "Your listening is concentrated around rap, grime, and adjacent UK-heavy lanes, so the profile reads focused rather than eclectic.",
      },
      {
        label: "Core anchor",
        text: "One artist carries a lot of identity weight, which is the kind of pattern that makes Wrapped-style storytelling feel sharp.",
      },
      {
        label: "Repeat behavior",
        text: "Your strongest track peaks are substantial, so the catalog clearly has a small set of songs that define the profile.",
      },
      {
        label: "Social fit",
        text: "The profile lines up more naturally with scene-led nights than with generic background listening.",
      },
    ],
    signatureTracks: [],
  },
  tasteSignals,
  sceneMatches,
  dancePathways,
  topArtists: [
    { artistName: "Tems", secondsTotal: 0, trackCount: 0 },
    { artistName: "Kaytranada", secondsTotal: 0, trackCount: 0 },
    { artistName: "SZA", secondsTotal: 0, trackCount: 0 },
    { artistName: "Bad Bunny", secondsTotal: 0, trackCount: 0 },
  ],
  topGenres: [
    { genre: "afrobeats", count: 0, scene: "Afrobeats lounge", venue: "DJ-led lounge or listening bar" },
    { genre: "house", count: 0, scene: "House-forward set", venue: "dance floor or underground club" },
    { genre: "r&b", count: 0, scene: "R&B social night", venue: "intimate bar or lounge" },
  ],
  topTracks: [
    {
      rank: 1,
      trackId: "demo-1",
      trackName: "Closer",
      artistName: "Tems",
      secondsTotal: 0,
      coverUrl: null,
      albumName: "Demo",
    },
    {
      rank: 2,
      trackId: "demo-2",
      trackName: "Midnight Drive",
      artistName: "Kaytranada",
      secondsTotal: 0,
      coverUrl: null,
      albumName: "Demo",
    },
    {
      rank: 3,
      trackId: "demo-3",
      trackName: "Smoke Break",
      artistName: "SZA",
      secondsTotal: 0,
      coverUrl: null,
      albumName: "Demo",
    },
    {
      rank: 4,
      trackId: "demo-4",
      trackName: "La Cancion",
      artistName: "Bad Bunny",
      secondsTotal: 0,
      coverUrl: null,
      albumName: "Demo",
    },
  ],
};
