import { describe, it, expect } from "vitest";
import {
  recommendSummarySchema,
  slottingItemSchema,
  slottingOptimizationSchema,
  distanceMetricsSchema,
  recommendationDataSchema,
  recommendResponseSchema,
} from "../../src/features/slotting/schemas/recommend.schema";

describe("recommendSummarySchema", () => {
  it("accepts valid summary", () => {
    const result = recommendSummarySchema.safeParse({
      warehouse: "Alpha",
      total_orders: 100,
      total_items: 250,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative total_orders", () => {
    expect(
      recommendSummarySchema.safeParse({
        warehouse: "Alpha",
        total_orders: -1,
        total_items: 250,
      }).success,
    ).toBe(false);
  });

  it("rejects non-integer total_orders", () => {
    expect(
      recommendSummarySchema.safeParse({
        warehouse: "Alpha",
        total_orders: 1.5,
        total_items: 250,
      }).success,
    ).toBe(false);
  });

  it("rejects missing warehouse", () => {
    expect(
      recommendSummarySchema.safeParse({
        total_orders: 100,
        total_items: 250,
      }).success,
    ).toBe(false);
  });
});

describe("slottingItemSchema", () => {
  it("accepts valid item", () => {
    expect(
      slottingItemSchema.safeParse({
        product: "Mie Instan",
        location: "Aisle 1, Shelf A",
      }).success,
    ).toBe(true);
  });

  it("rejects empty product", () => {
    expect(
      slottingItemSchema.safeParse({
        product: "",
        location: "Aisle 1, Shelf A",
      }).success,
    ).toBe(false);
  });

  it("rejects empty location", () => {
    expect(
      slottingItemSchema.safeParse({
        product: "Mie",
        location: "",
      }).success,
    ).toBe(false);
  });
});

describe("slottingOptimizationSchema", () => {
  it("accepts valid before/after arrays", () => {
    expect(
      slottingOptimizationSchema.safeParse({
        before: [{ product: "A", location: "Aisle 1, Shelf A" }],
        after: [{ product: "A", location: "Aisle 2, Shelf B" }],
      }).success,
    ).toBe(true);
  });

  it("accepts empty arrays", () => {
    expect(
      slottingOptimizationSchema.safeParse({ before: [], after: [] }).success,
    ).toBe(true);
  });
});

describe("distanceMetricsSchema", () => {
  it("accepts valid metrics", () => {
    expect(
      distanceMetricsSchema.safeParse({
        before: 1000,
        after: 600,
        saved: 400,
        saving_percentage: 40.0,
      }).success,
    ).toBe(true);
  });

  it("rejects negative before distance", () => {
    expect(
      distanceMetricsSchema.safeParse({
        before: -100,
        after: 600,
        saved: 400,
        saving_percentage: 40.0,
      }).success,
    ).toBe(false);
  });

  it("rejects negative after distance", () => {
    expect(
      distanceMetricsSchema.safeParse({
        before: 1000,
        after: -600,
        saved: 400,
        saving_percentage: 40.0,
      }).success,
    ).toBe(false);
  });

  it("accepts zero saving_percentage", () => {
    expect(
      distanceMetricsSchema.safeParse({
        before: 1000,
        after: 1000,
        saved: 0,
        saving_percentage: 0,
      }).success,
    ).toBe(true);
  });
});

describe("recommendResponseSchema", () => {
  it("accepts valid full response", () => {
    const result = recommendResponseSchema.safeParse({
      success: true,
      message: "OK",
      data: {
        summary: { warehouse: "Alpha", total_orders: 50, total_items: 120 },
        slotting: {
          before: [{ product: "A", location: "Aisle 1, Shelf A" }],
          after: [{ product: "A", location: "Aisle 2, Shelf B" }],
        },
        picking_route: ["START", "A", "EXIT"],
        distance: {
          before: 100,
          after: 60,
          saved: 40,
          saving_percentage: 40,
        },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects success: false", () => {
    expect(
      recommendResponseSchema.safeParse({
        success: false,
        message: "Error",
        data: {},
      }).success,
    ).toBe(false);
  });

  it("rejects response missing data field", () => {
    expect(
      recommendResponseSchema.safeParse({
        success: true,
        message: "OK",
      }).success,
    ).toBe(false);
  });
});
