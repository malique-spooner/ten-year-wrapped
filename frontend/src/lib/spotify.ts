const clientId = "91a23d042d3f406ab47ff1477b661024";
export const spotifyRedirectUri = "https://maliquespooner.com/wrapped/";
const scopes = ["user-library-read", "user-read-currently-playing", "playlist-read-private"];
const storageKey = "wrapped.spotify.tokens.v1";

type Tokens = { access_token: string; refresh_token?: string; expires_at: number };
export type SpotifyImage = { url: string; width?: number; height?: number };
export type SpotifyArtist = { name: string };
export type SpotifyTrack = {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: { name: string; images: SpotifyImage[]; external_urls?: { spotify?: string } };
  external_urls?: { spotify?: string };
  duration_ms?: number;
};
export type SpotifyAlbum = {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
  total_tracks?: number;
  external_urls?: { spotify?: string };
};
export type SpotifyPlaylist = {
  id: string;
  name: string;
  images: SpotifyImage[];
  tracks?: { total?: number };
  owner?: { display_name?: string };
  external_urls?: { spotify?: string };
};
export type SpotifyPage<T> = { items: T[]; next: string | null; total: number };
export type Playing = { is_playing: boolean; progress_ms?: number; item?: SpotifyTrack | null; timestamp?: number } | null;

function readTokens(): Tokens | null {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) as Tokens : null;
  } catch { return null; }
}

function writeTokens(tokens: Tokens) { localStorage.setItem(storageKey, JSON.stringify(tokens)); }

async function sha256(value: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

function base64url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function connectSpotify() {
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(64)));
  const state = base64url(crypto.getRandomValues(new Uint8Array(24)));
  sessionStorage.setItem("wrapped.spotify.verifier", verifier);
  sessionStorage.setItem("wrapped.spotify.state", state);
  const challenge = base64url(await sha256(verifier));
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: spotifyRedirectUri,
    scope: scopes.join(" "),
    state,
    code_challenge_method: "S256",
    code_challenge: challenge,
  });
  window.location.assign("https://accounts.spotify.com/authorize?" + params.toString());
}

export async function finishSpotifyConnection(): Promise<string | null> {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  if (!code && !error) return null;
  const expectedState = sessionStorage.getItem("wrapped.spotify.state");
  const verifier = sessionStorage.getItem("wrapped.spotify.verifier");
  sessionStorage.removeItem("wrapped.spotify.state");
  sessionStorage.removeItem("wrapped.spotify.verifier");
  url.searchParams.delete("code");
  url.searchParams.delete("state");
  url.searchParams.delete("error");
  window.history.replaceState({}, "", url.pathname + url.hash);
  if (error) return error === "access_denied" ? "Spotify access was cancelled." : "Spotify could not connect.";
  if (!expectedState || state !== expectedState || !verifier || !code) return "Spotify sign-in expired. Please connect again.";
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: spotifyRedirectUri,
      code_verifier: verifier,
    }),
  });
  const payload = await response.json();
  if (!response.ok) return payload.error_description || "Spotify could not connect.";
  writeTokens({ access_token: payload.access_token, refresh_token: payload.refresh_token, expires_at: Date.now() + payload.expires_in * 1000 });
  return "connected";
}

async function accessToken(): Promise<string> {
  let tokens = readTokens();
  if (!tokens) throw new Error("Connect Spotify to see your library.");
  if (Date.now() < tokens.expires_at - 60_000) return tokens.access_token;
  if (!tokens.refresh_token) { localStorage.removeItem(storageKey); throw new Error("Your Spotify connection expired. Please connect again."); }
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, grant_type: "refresh_token", refresh_token: tokens.refresh_token }),
  });
  const payload = await response.json();
  if (!response.ok) { localStorage.removeItem(storageKey); throw new Error("Your Spotify connection expired. Please connect again."); }
  tokens = { access_token: payload.access_token, refresh_token: payload.refresh_token || tokens.refresh_token, expires_at: Date.now() + payload.expires_in * 1000 };
  writeTokens(tokens);
  return tokens.access_token;
}

export async function spotifyRequest<T>(path: string): Promise<T> {
  const response = await fetch(path.startsWith("https://") ? path : "https://api.spotify.com/v1" + path, {
    headers: { Authorization: "Bearer " + await accessToken() },
  });
  if (response.status === 204) return null as T;
  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem(storageKey);
    if (response.status === 403) throw new Error("Spotify has not approved this account for the app yet.");
    throw new Error("Spotify is temporarily unavailable. Please try again.");
  }
  return response.json() as Promise<T>;
}

export function disconnectSpotify() {
  localStorage.removeItem(storageKey);
  sessionStorage.removeItem("wrapped.spotify.verifier");
  sessionStorage.removeItem("wrapped.spotify.state");
}

export function isSpotifyConnected() { return Boolean(readTokens()); }
