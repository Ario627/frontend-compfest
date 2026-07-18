import { describe, it, expect } from "vitest";
import {
  parseLocation,
  computeGridDimensions,
  buildPositionIndex,
  getCellPosition,
} from "../../src/features/slotting/utils/grid-layout";
import type { SlottingItem } from "../../src/features/slotting/types/slotting.types";

describe("parseLocation", () => {
  it("parses standard Aisle/Shelf format", () => {
    expect(parseLocation("Aisle 3, Shelf A")).toEqual({
      aisle: 3,
      position: "A",
    });
  });

  it("parses case-insensitive format", () => {
    expect(parseLocation("aisle 1, shelf B")).toEqual({
      aisle: 1,
      position: "B",
    });
  });

  it("handles extra whitespace", () => {
    expect(parseLocation("Aisle  2,  Shelf  C")).toEqual({
      aisle: 2,
      position: "C",
    });
  });

  it("falls back to hash-based aisle for unknown format", () => {
    const result = parseLocation("Zone-X");
    expect(result.aisle).toBeGreaterThanOrEqual(1);
    expect(result.aisle).toBeLessThanOrEqual(5);
    expect(result.position).toBe("Zone-X");
  });
});

describe("computeGridDimensions", () => {
  it("returns zero dimensions for empty slotting", () => {
    const dims = computeGridDimensions([]);
    expect(dims.aisleCount).toBe(0);
    expect(dims.positionsPerAisle).toBe(0);
    expect(dims.canvasWidth).toBe(0);
    expect(dims.canvasHeight).toBe(0);
  });

  it("computes correct aisle and position counts", () => {
    const items: SlottingItem[] = [
      { product: "A", location: "Aisle 1, Shelf A" },
      { product: "B", location: "Aisle 1, Shelf B" },
      { product: "C", location: "Aisle 2, Shelf A" },
      { product: "D", location: "Aisle 2, Shelf B" },
    ];
    const dims = computeGridDimensions(items);
    expect(dims.aisleCount).toBe(2);
    expect(dims.positionsPerAisle).toBe(2);
  });

  it("caps cell size at 60px max", () => {
    const items: SlottingItem[] = [
      { product: "A", location: "Aisle 1, Shelf A" },
      { product: "B", location: "Aisle 1, Shelf B" },
    ];
    const dims = computeGridDimensions(items);
    expect(dims.cellWidth).toBeLessThanOrEqual(60);
    expect(dims.cellHeight).toBeLessThanOrEqual(60);
  });

  it("produces positive canvas dimensions for valid data", () => {
    const items: SlottingItem[] = [
      { product: "A", location: "Aisle 1, Shelf A" },
      { product: "B", location: "Aisle 2, Shelf B" },
      { product: "C", location: "Aisle 3, Shelf C" },
    ];
    const dims = computeGridDimensions(items);
    expect(dims.canvasWidth).toBeGreaterThan(0);
    expect(dims.canvasHeight).toBeGreaterThan(0);
  });
});

describe("buildPositionIndex", () => {
  it("creates sorted position index", () => {
    const items: SlottingItem[] = [
      { product: "A", location: "Aisle 1, Shelf C" },
      { product: "B", location: "Aisle 1, Shelf A" },
      { product: "C", location: "Aisle 2, Shelf B" },
    ];
    const index = buildPositionIndex(items);
    expect(index.get("A")).toBe(0);
    expect(index.get("B")).toBe(1);
    expect(index.get("C")).toBe(2);
  });

  it("deduplicates positions", () => {
    const items: SlottingItem[] = [
      { product: "A", location: "Aisle 1, Shelf A" },
      { product: "B", location: "Aisle 2, Shelf A" },
    ];
    const index = buildPositionIndex(items);
    expect(index.size).toBe(1);
  });
});

describe("getCellPosition", () => {
  it("returns correct x,y for a given location", () => {
    const items: SlottingItem[] = [
      { product: "A", location: "Aisle 1, Shelf A" },
      { product: "B", location: "Aisle 1, Shelf B" },
      { product: "C", location: "Aisle 2, Shelf A" },
      { product: "D", location: "Aisle 2, Shelf B" },
    ];
    const dims = computeGridDimensions(items);
    const posIndex = buildPositionIndex(items);

    const posA = getCellPosition("Aisle 1, Shelf A", dims, posIndex);
    const posB = getCellPosition("Aisle 1, Shelf B", dims, posIndex);
    const posC = getCellPosition("Aisle 2, Shelf A", dims, posIndex);

    expect(posA.x).toBeLessThan(posB.x);
    expect(posA.y).toBeLessThan(posC.y);
    expect(posA.x).toBe(posC.x);
  });
});
