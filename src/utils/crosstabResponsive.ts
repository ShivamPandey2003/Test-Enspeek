export const CROSSTAB_HEADER_ACTION_PRIORITY = [
  "create",
  "history",
  "search",
] as const;

export const BANNER_CARD_ACTION_PRIORITY = [
  "view",
  "edit",
  "copy",
  "settings",
  "download",
  "delete",
] as const;

export const TABLE_HEADER_ACTION_PRIORITY = [
  "banner-selector",
  "download",
  "settings",
] as const;

export const TABLE_CARD_ACTION_PRIORITY = [
  "refresh",
  "download",
  "edit",
] as const;

export const getOverflowOrder = <T extends string>(
  priority: readonly T[]
): T[] => [...priority].reverse();

export const shouldUseCompactBreadcrumbs = (
  contentWidth: number,
  availableWidth: number
) => contentWidth > availableWidth;
