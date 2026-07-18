import { describe, it, expect } from "vitest";
import {
  datasetItemSchema,
  datasetsResponseSchema,
} from "../../src/features/slotting/schemas/demo.schema";

describe("datasetItemSchema", () => {
  it("accepts valid dataset item", () => {
    expect(
      datasetItemSchema.safeParse({ id: "small", name: "Batch Kecil" }).success,
    ).toBe(true);
  });

  it("rejects empty id", () => {
    expect(datasetItemSchema.safeParse({ id: "", name: "Batch" }).success).toBe(
      false,
    );
  });

  it("rejects empty name", () => {
    expect(datasetItemSchema.safeParse({ id: "small", name: "" }).success).toBe(
      false,
    );
  });

  it("rejects missing fields", () => {
    expect(datasetItemSchema.safeParse({ id: "small" }).success).toBe(false);
  });

  it("rejects non-string id", () => {
    expect(datasetItemSchema.safeParse({ id: 123, name: "X" }).success).toBe(
      false,
    );
  });
});

describe("datasetsResponseSchema", () => {
  it("accepts valid response with datasets array", () => {
    expect(
      datasetsResponseSchema.safeParse({
        datasets: [
          { id: "small", name: "Small" },
          { id: "medium", name: "Medium" },
        ],
      }).success,
    ).toBe(true);
  });

  it("accepts empty datasets array", () => {
    expect(datasetsResponseSchema.safeParse({ datasets: [] }).success).toBe(
      true,
    );
  });

  it("rejects missing datasets field", () => {
    expect(datasetsResponseSchema.safeParse({}).success).toBe(false);
  });

  it("rejects datasets as non-array", () => {
    expect(
      datasetsResponseSchema.safeParse({ datasets: "not-array" }).success,
    ).toBe(false);
  });

  it("rejects datasets with invalid items", () => {
    expect(
      datasetsResponseSchema.safeParse({
        datasets: [{ id: "", name: "" }],
      }).success,
    ).toBe(false);
  });
});
