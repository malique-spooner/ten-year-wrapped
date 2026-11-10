export type EraPoint = {
  year: number;
  hours: number;
  topArtist: string;
  topTrack: string;
  topGenre: string;
  discoveryRate: number;
  artistCount: number;
  trackCount: number;
  newArtists: number;
  topArtistShare: number;
  topTrackShare: number;
};

export type SignatureTrack = {
  id: string;
  rank: number;
  trackName: string;
  artistName: string;
  playsOrSeconds: number;
  coverUrl?: string | null;
  albumName?: string | null;
  kind: "track" | "artist" | "album" | "moment";
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
};

export type GenreSeriesPoint = {
  year: number;
  hours: number;
  share: number;
};

export type GenreSeries = {
  genre: string;
  sceneLabel: string;
  firstYear: number | null;
  peakYear: number | null;
  peakShare: number;
  relatedTopArtists: string[];
  series: GenreSeriesPoint[];
};

export type DiscoveryPoint = {
  year: number;
  newCount: number;
  returningCount: number;
};

export type PrototypePayload = {
  listeningSnapshot: ListeningSnapshot;
  listeningEras: {
    selectedYear?: number | null;
    years: EraPoint[];
  };
  signatureRecords: {
    tracks: SignatureTrack[];
  };
  genreDrift: {
    selectedGenre: string;
    genres: GenreSeries[];
  };
  discoveryVsComfort: {
    selectedMode: string;
    modes: string[];
    series: Record<string, DiscoveryPoint[]>;
  };
  topArtists: Array<{
    artistName: string;
    secondsTotal: number;
    trackCount: number;
  }>;
};
