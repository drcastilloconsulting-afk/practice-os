// ─────────────────────────────────────────────────────────
// UA Squad — Cohort Definitions & Scoring Utilities
// ─────────────────────────────────────────────────────────

/** Cohort identifier (union of all valid cohort IDs) */
export type CohortId = 'cohort-30-45' | 'cohort-45-60';

/** Cohort definition */
export interface Cohort {
  /** Unique cohort identifier */
  id: CohortId;
  /** Human-readable label */
  label: string;
  /** Minimum age (inclusive) */
  ageMin: number;
  /** Maximum age (inclusive) */
  ageMax: number;
  /** Prize amount for the subscriber winner (in cents) */
  prizeAmount: number;
}

// ─── Prize Constants (in cents) ───────────────────────────

/** $5,000 wellness package per winner */
export const PRIZE_AMOUNT_SUBSCRIBER = 500000;

/** $10,000 clinic payout per winner */
export const PRIZE_AMOUNT_CLINIC = 1000000;

/** Number of winners per cohort per competition period */
export const WINNERS_PER_COHORT = 1;

// ─── Cohort Registry ─────────────────────────────────────

/**
 * All UA Squad cohorts.
 * Mixed gender — male & female compete together.
 * Winner = biggest delta (most improvement) regardless of gender.
 */
export const COHORTS: Cohort[] = [
  {
    id: 'cohort-30-45',
    label: 'Ages 30–45',
    ageMin: 30,
    ageMax: 45,
    prizeAmount: PRIZE_AMOUNT_SUBSCRIBER,
  },
  {
    id: 'cohort-45-60',
    label: 'Ages 45–60',
    ageMin: 45,
    ageMax: 60,
    prizeAmount: PRIZE_AMOUNT_SUBSCRIBER,
  },
];

// ─── Lookup Helpers ───────────────────────────────────────

/**
 * Get a human-readable label for a cohort ID.
 * Returns `"Unknown Cohort"` if the ID is not recognised.
 */
export function getCohortLabel(cohortId: string): string {
  const cohort = COHORTS.find((c) => c.id === cohortId);
  return cohort?.label ?? 'Unknown Cohort';
}

/**
 * Determine which cohort an age falls into.
 * Age boundaries are inclusive on both ends.
 * Returns `undefined` if the age doesn't fall into any cohort.
 */
export function getCohortForAge(age: number): Cohort | undefined {
  return COHORTS.find((c) => age >= c.ageMin && age <= c.ageMax);
}

/** Return the full cohort registry (defensive copy). */
export function getAllCohorts(): Cohort[] {
  return [...COHORTS];
}

// ─── Scoring ──────────────────────────────────────────────

/**
 * Calculate the improvement delta between two scores.
 * Positive value = improvement, negative = regression.
 *
 * Winner is the subscriber with the **biggest positive delta**
 * within their cohort during a competition period.
 */
export function calculateDelta(
  currentScore: number,
  previousScore: number,
): number {
  return currentScore - previousScore;
}
