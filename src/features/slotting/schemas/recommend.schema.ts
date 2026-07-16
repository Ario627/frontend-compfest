import { z } from "zod";

export const recommendSummarySchema = z.object({
  warehouse: z.string(),
  total_orders: z.number().int().min(0),
  total_items: z.number().int().min(0),
});

export const slottingItemSchema = z.object({
  product: z.string().min(1),
  location: z.string().min(1),
});

export const slottingOptimizationSchema = z.object({
  before: z.array(slottingItemSchema),
  after: z.array(slottingItemSchema),
});

export const distanceMetricsSchema = z.object({
  before: z.number().min(0),
  after: z.number().min(0),
  saved: z.number(),
  saving_percentage: z.number(),
});

export const recommendationDataSchema = z.object({
  summary: recommendSummarySchema,
  slotting: slottingOptimizationSchema,
  picking_route: z.array(z.string()),
  distance: distanceMetricsSchema,
});

export const recommendResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: recommendationDataSchema,
});

export type RecommendResponseParsed = z.infer<typeof recommendResponseSchema>;
export type RecommendationDataParsed = z.infer<typeof recommendationDataSchema>;
