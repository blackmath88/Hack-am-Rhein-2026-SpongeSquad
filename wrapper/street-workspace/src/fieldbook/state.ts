import type { DesignFuture } from "./evidence.ts";

export type Weather = "dry" | "heat" | "rain";
export type FutureId = DesignFuture["id"];
export type NoteKey = "roof" | "root" | "rain" | "underground" | "planting";

export const WEATHERS: Weather[] = ["dry", "heat", "rain"];
