import { env } from "./data/env/serve";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schema.ts",
  strict: true,
  verbose: true,
  dialect: "postgresql",
  dbCredentials: {
    password: env.DATABASE_PASSWORD,
    user: env.DATABASE_USER,
    database: env.DATABASE_NAME,
    host: env.DATABASE_HOST,
    ssl: false,
  },
});
