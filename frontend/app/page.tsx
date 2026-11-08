import { SpotifyDeck } from "@/components/SpotifyDeck";
import snapshot from "@/data/demo.json";
import type { PrototypePayload } from "@/data/prototype";
export default function Page() { return <SpotifyDeck data={snapshot as unknown as PrototypePayload} dataSource="api" />; }
