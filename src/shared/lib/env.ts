import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default("http://localhost:8000"),
  VITE_USE_MOCK: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  VITE_APP_NAME: z.string().default("Warehouse Slotting Optimizer"),
});

function parseEnv() {
  const parsed = envSchema.safeParse({
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_USE_MOCK: import.meta.env.VITE_USE_MOCK,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  });

  if (!parsed.success) {
    const errors = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n  ");
    throw new Error(`[ENV] Invalid environment variables:\n  ${errors}`);
  }

  return parsed.data;
}

export const env = parseEnv();
export type Env = typeof env;