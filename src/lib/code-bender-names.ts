import { getOrdinal } from "./ordinals";

/** Number of rank slots per specialization (e.g. FirstFrontendBender ... 200th). */
export const RANKS_PER_SPECIALIZATION = 200;

/** Single bending specialization (e.g. Frontend Bender) with its folder label and name suffix. */
export type BendingSpecialization = {
  id: string;
  label: string;
  /** Suffix for rank names, e.g. "FrontendBender" -> FirstFrontendBender */
  nameSuffix: string;
};

/** Bending specializations: each has 200 ranks (FirstX, SecondX, ...). */
export const BENDING_SPECIALIZATIONS: BendingSpecialization[] = [
  { id: "frontend-bender", label: "Frontend Bender", nameSuffix: "FrontendBender" },
  { id: "backend-bender", label: "Backend Bender", nameSuffix: "BackendBender" },
  { id: "fullstack-bender", label: "FullStack Bender", nameSuffix: "FullStackBender" },
  { id: "security-bender", label: "Security Bender", nameSuffix: "SecurityBender" },
  { id: "ai-bender", label: "AI Bender", nameSuffix: "AIBender" },
  { id: "devops-bender", label: "DevOps Bender", nameSuffix: "DevOpsBender" },
];

export type BenderRank = {
  /** URL segment: e.g. "frontend-bender-firstfrontendbender" */
  fullId: string;
  /** Normalized key for lookup (no hyphens, lowercase) */
  normalizedId: string;
  /** Display name: e.g. "FirstFrontendBender" */
  displayName: string;
};

function buildCodeBenderNames(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const spec of BENDING_SPECIALIZATIONS) {
    for (let n = 1; n <= RANKS_PER_SPECIALIZATION; n++) {
      const ordinal = getOrdinal(n);
      const displayName = ordinal + spec.nameSuffix;
      const rankId = displayName.toLowerCase();
      const fullId = `${spec.id}-${rankId}`;
      const normalizedId = fullId.toLowerCase().replace(/-/g, "");
      map[normalizedId] = displayName;
    }
  }
  return map;
}

/** Lookup: normalized id -> display name (e.g. "frontendbenderfirstfrontendbender" -> "FirstFrontendBender"). */
export const codeBenderNames: Record<string, string> = buildCodeBenderNames();

/** Normalized id -> specialization label for path display (e.g. "Frontend Bender"). */
function buildSpecializationByBender(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const spec of BENDING_SPECIALIZATIONS) {
    for (let n = 1; n <= RANKS_PER_SPECIALIZATION; n++) {
      const ordinal = getOrdinal(n);
      const displayName = ordinal + spec.nameSuffix;
      const rankId = displayName.toLowerCase();
      const fullId = `${spec.id}-${rankId}`;
      const normalizedId = fullId.toLowerCase().replace(/-/g, "");
      map[normalizedId] = spec.label;
    }
  }
  return map;
}

export const codeBenderSpecializationLabel: Record<string, string> = buildSpecializationByBender();

/** Returns specializations with their bender ranks for the sidebar tree. */
export function getBendingSpecializationsWithRanks(): Array<BendingSpecialization & { benders: BenderRank[] }> {
  return BENDING_SPECIALIZATIONS.map((spec) => {
    const benders: BenderRank[] = [];
    for (let n = 1; n <= RANKS_PER_SPECIALIZATION; n++) {
      const ordinal = getOrdinal(n);
      const displayName = ordinal + spec.nameSuffix;
      const rankId = displayName.toLowerCase();
      const fullId = `${spec.id}-${rankId}`;
      const normalizedId = fullId.toLowerCase().replace(/-/g, "");
      benders.push({ fullId, normalizedId, displayName });
    }
    return { ...spec, benders };
  });
}

/** Get specialization label for a bender (for path display). */
export function getSpecializationLabelForBender(normalizedId: string): string | undefined {
  return codeBenderSpecializationLabel[normalizedId];
}
