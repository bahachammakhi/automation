import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export const env = createEnv({
  clientPrefix: "PUBLIC_",
  server: {
    NOTION_API_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: process.env, // or `import.meta.env`, or similar
});
