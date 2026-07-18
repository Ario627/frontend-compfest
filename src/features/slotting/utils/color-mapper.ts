const CATEGORY_COLORS: readonly string[] = [
  "#1E3A52",
  "#24455E",
  "#2A506A",
  "#305B76",
  "#366682",
  "#3C718E",
  "#427C9A",
  "#4887A6",
  "#4E92B2",
  "#549DBE",
];

const cache = new Map<string, string>();
let nextIndex = 0;

export function getCategoryColor(product: string): string {
  const cached = cache.get(product);
  if (cached) return cached;

  const color = CATEGORY_COLORS[nextIndex % CATEGORY_COLORS.length];
  nextIndex++;
  cache.set(product, color);
  return color;
}

export function getHighlightColor(isHighlighted: boolean): string {
  return isHighlighted ? "#F2B705" : "";
}

export function resetColorCache(): void {
  cache.clear();
  nextIndex = 0;
}
