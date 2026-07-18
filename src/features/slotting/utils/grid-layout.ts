import type { SlottingItem, GridDimensions } from "../types/slotting.types";

const MAX_CELL_SIZE = 60;
const CELL_GAP = 10;
const PADDING = 10;
const MAX_CANVAS_WIDTH = 900;
const MAX_CANVAS_HEIGHT = 500;
const VIEWPORT_RATIO = 0.65;

interface ParsedLocation {
  aisle: number;
  position: string;
}

export function parseLocation(location: string): ParsedLocation {
  const match = location.match(/Aisle\s*(\d+),\s*Shelf\s*(\w+)/i);
  if (match) {
    return { aisle: parseInt(match[1], 10), position: match[2] };
  }
  return { aisle: (location.charCodeAt(0) % 5) + 1, position: location };
}

export function computeGridDimensions(
  slotting: SlottingItem[],
): GridDimensions {
  if (slotting.length === 0) {
    return {
      aisleCount: 0,
      positionsPerAisle: 0,
      cellWidth: MAX_CELL_SIZE,
      cellHeight: MAX_CELL_SIZE,
      aisleGap: MAX_CELL_SIZE * 0.6,
      canvasWidth: 0,
      canvasHeight: 0,
    };
  }

  const parsed = slotting.map((item) => parseLocation(item.location));
  const aisleNumbers = [...new Set(parsed.map((p) => p.aisle))].sort(
    (a, b) => a - b,
  );
  const positions = [...new Set(parsed.map((p) => p.position))].sort();

  const aisleCount = aisleNumbers.length;
  const positionsPerAisle = positions.length;

  const maxWidth = Math.min(
    typeof window !== "undefined"
      ? window.innerWidth * VIEWPORT_RATIO
      : MAX_CANVAS_WIDTH,
    MAX_CANVAS_WIDTH,
  );

  const cellWidth = Math.floor(
    (maxWidth - (positionsPerAisle + 1) * CELL_GAP) / positionsPerAisle,
  );
  const cellHeight = Math.floor(
    (MAX_CANVAS_HEIGHT - (aisleCount + 1) * CELL_GAP) / aisleCount,
  );

  const cellSize = Math.min(cellWidth, cellHeight, MAX_CELL_SIZE);
  const aisleGap = cellSize * 0.6;

  const canvasWidth =
    positionsPerAisle * cellSize +
    (positionsPerAisle + 1) * CELL_GAP +
    PADDING * 2;
  const canvasHeight =
    aisleCount * (cellSize + aisleGap) + aisleGap + PADDING * 2;

  return {
    aisleCount,
    positionsPerAisle,
    cellWidth: cellSize,
    cellHeight: cellSize,
    aisleGap,
    canvasWidth,
    canvasHeight,
  };
}

export function buildPositionIndex(
  slotting: SlottingItem[],
): Map<string, number> {
  const positions = new Set<string>();
  for (const item of slotting) {
    positions.add(parseLocation(item.location).position);
  }

  const sorted = [...positions].sort();
  const index = new Map<string, number>();
  sorted.forEach((pos, i) => index.set(pos, i));
  return index;
}

export function getCellPosition(
  location: string,
  dimensions: GridDimensions,
  positionIndex: Map<string, number>,
): { x: number; y: number } {
  const { aisle, position } = parseLocation(location);
  const aisleIndex = aisle - 1;
  const posIndex = positionIndex.get(position) ?? 0;

  return {
    x: PADDING + CELL_GAP + posIndex * (dimensions.cellWidth + CELL_GAP),
    y:
      PADDING +
      dimensions.aisleGap +
      aisleIndex * (dimensions.cellHeight + dimensions.aisleGap),
  };
}