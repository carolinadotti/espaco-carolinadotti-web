import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations usam conexão direta (sem pooler)
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
})
