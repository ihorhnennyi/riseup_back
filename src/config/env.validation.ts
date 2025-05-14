import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().optional(),
  MONGO_URI: z.string().url(),
  JWT_SECRET: z.string().min(10),
  JWT_EXPIRES_IN: z.string().optional(),
});

export type EnvVars = z.infer<typeof envSchema>;
