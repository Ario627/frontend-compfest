import {z} from "zod";

export const datasetItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const datasetsResponseSchema = z.object({
  datasets: z.array(datasetItemSchema),
});

export type DatasetItemParsed = z.infer<typeof datasetItemSchema>;
export type DatasetsResponseParsed = z.infer<typeof datasetsResponseSchema>;
