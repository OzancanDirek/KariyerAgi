export const PROFILE_OVERVIEW_LIMIT = 3;

export function visibleProfileRecords(items, limit) {
  return limit == null ? items : items.slice(0, limit);
}
