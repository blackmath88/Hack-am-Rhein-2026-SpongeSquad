import type { CandidateArea } from '../types';

export type CandidateSiteHandoffV1 = {
  version: 1;
  site: {
    id: string;
    name: string;
    district: string;
    coordinates: [number, number];
    indicators: { sources: string[]; missingData: string[] };
    constraints: string[];
    directions: string[];
  };
  provenance: {
    classification: 'illustrative';
    source: 'Basel Site Scoping Tool';
    note: string;
  };
};

function encodeBase64Url(value: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
}

export function candidateAreaToHandoff(area: CandidateArea): CandidateSiteHandoffV1 {
  return {
    version: 1,
    site: {
      id: area.id,
      name: area.name,
      district: area.district,
      coordinates: [...area.coordinates],
      indicators: {
        sources: [...area.indicators.sources],
        missingData: [...area.indicators.missingData],
      },
      constraints: [...area.constraints],
      directions: [...area.directions],
    },
    provenance: {
      classification: 'illustrative',
      source: 'Basel Site Scoping Tool',
      note: 'Candidate identity and evidence prompts only; no site geometry or hydraulic parameters are transferred.',
    },
  };
}

export function createStreetLabUrl(area: CandidateArea): string {
  const configured = import.meta.env.VITE_STREET_LAB_URL;
  const target = configured || (import.meta.env.DEV
    ? 'http://localhost:5174/wrapper/street-workspace/'
    : '../../wrapper/street-workspace/');
  const url = new URL(target, window.location.href);
  url.searchParams.set('site', encodeBase64Url(candidateAreaToHandoff(area)));
  return url.toString();
}
