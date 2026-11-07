import type { AppState, Badge } from "@/types";
import badgeData from "@/content/badges.json";

const badges = badgeData as Badge[];

/**
 * Evaluasi semua lencana berdasarkan state terkini.
 * Kembalikan array ID lencana yang sudah diperoleh.
 */
export function evaluateBadges(state: AppState): string[] {
  const totalDone = state.dailyTasks.filter(
    (t) => t.status === "done" || t.status === "swapped"
  ).length;
  const totalJournals = state.journalEntries.length;
  const streak = getStreakFromState(state);
  const leveledUp = (state.currentLevel ?? 1) > 1 ? 1 : 0;

  const context: Record<string, number> = {
    totalDone,
    totalJournals,
    streak,
    leveledUp,
  };

  const earned: string[] = [];

  for (const badge of badges) {
    if (evaluateRule(badge.rule, context)) {
      earned.push(badge.id);
    }
  }

  return earned;
}

/**
 * Evaluasi rule sederhana seperti "streak>=3" atau "totalDone>=1".
 */
function evaluateRule(rule: string, context: Record<string, number>): boolean {
  const match = rule.match(/^(\w+)(>=|<=|>|<|===?|!=)(\d+)$/);
  if (!match) return false;

  const [, key, op, valStr] = match;
  const val = parseInt(valStr, 10);
  const actual = context[key] ?? 0;

  switch (op) {
    case ">=": return actual >= val;
    case "<=": return actual <= val;
    case ">":  return actual > val;
    case "<":  return actual < val;
    case "===":
    case "==": return actual === val;
    case "!=": return actual !== val;
    default: return false;
  }
}

function getStreakFromState(state: AppState): number {
  // Import streak agar tidak circular; re-implementasi ringan
  const doneDates = state.dailyTasks
    .filter((t) => t.status === "done" || t.status === "swapped")
    .map((t) => t.date)
    .sort()
    .reverse();

  if (doneDates.length === 0) return 0;
  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);
  for (const dateStr of doneDates) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((current.getTime() - d.getTime()) / 86400000);
    if (diff === 0 || diff === 1) { streak++; current = d; }
    else break;
  }
  return streak;
}

export { badges };

