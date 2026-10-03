// Deterministic screening arithmetic. Every uncertain input is a range and
// every output is a range; nothing here is a drainage design or a prediction.
import type { ScenarioRange } from "./evidence.ts";

export type Interval = { min: number; max: number };

export const interval = (min: number, max: number = min): Interval => {
  if (!Number.isFinite(min) || !Number.isFinite(max)) throw new RangeError("Range bounds must be finite numbers");
  if (min < 0 || max < 0) throw new RangeError("Screening inputs must be non-negative");
  if (min > max) throw new RangeError(`Range minimum ${min} exceeds maximum ${max}`);
  return { min, max };
};

/** Product of non-negative intervals: lowest bounds together, highest bounds together. */
export const product = (...factors: Interval[]): Interval =>
  factors.reduce((acc, f) => ({ min: acc.min * f.min, max: acc.max * f.max }), { min: 1, max: 1 });

export const sum = (...terms: Interval[]): Interval =>
  terms.reduce((acc, t) => ({ min: acc.min + t.min, max: acc.max + t.max }), { min: 0, max: 0 });

export type RunoffInputs = {
  rainfallMm: Interval;
  sealedAreaM2: Interval;
  runoffCoefficient: Interval;
};

/** V_runoff = P × A_impervious × C, in m³. */
export const runoffVolume = ({ rainfallMm, sealedAreaM2, runoffCoefficient }: RunoffInputs): Interval => {
  if (runoffCoefficient.max > 1) throw new RangeError("Runoff coefficient cannot exceed 1");
  return product({ min: rainfallMm.min / 1000, max: rainfallMm.max / 1000 }, sealedAreaM2, runoffCoefficient);
};

export type StorageInputs = {
  areaM2: Interval;
  activeDepthM: Interval;
  voidFraction: Interval;
};

/** V_storage = A_intervention × d_active × n, in m³. */
export const storageVolume = ({ areaM2, activeDepthM, voidFraction }: StorageInputs): Interval => {
  if (voidFraction.max > 1) throw new RangeError("Void fraction cannot exceed 1");
  return product(areaM2, activeDepthM, voidFraction);
};

/**
 * Share of an exposed ground strip covered by a projected shadow width,
 * read from one section at one sun angle. Overlaps are ignored; capped at 1.
 */
export const shadeShare = (shadowWidthM: Interval, exposedWidthM: number): Interval => {
  if (!(exposedWidthM > 0)) throw new RangeError("Exposed width must be positive");
  return {
    min: Math.min(1, shadowWidthM.min / exposedWidthM),
    max: Math.min(1, shadowWidthM.max / exposedWidthM),
  };
};

export const toScenario = (
  label: string,
  value: Interval,
  unit: string,
  basis: string,
  limitation: string,
): ScenarioRange => ({ label, minimum: value.min, maximum: value.max, unit, basis, limitation });

const fmt = (n: number, digits: number) =>
  n.toLocaleString("en-GB", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** "6.7–13.4 m³" — always a range, never a single number. */
export const formatRange = (r: { minimum: number; maximum: number; unit: string }, digits = 1): string => {
  if (r.unit === "%") return `${fmt(r.minimum * 100, 0)}–${fmt(r.maximum * 100, 0)} %`;
  return `${fmt(r.minimum, digits)}–${fmt(r.maximum, digits)} ${r.unit}`;
};
