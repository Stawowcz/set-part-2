import type { EnvVars } from "@typings/config/env-types";

export const env = process.env as unknown as EnvVars;
