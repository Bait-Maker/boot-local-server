import { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
  api: APIConfig;
  db: DBConfig;
};

type APIConfig = {
  fileserverHits: number;
  port: number;
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};

export const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

process.loadEnvFile();

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Cannot find Environment variable: ${key}`);
  }
  return value;
}

export const config: Config = {
  api: {
    fileserverHits: 0,
    port: Number(envOrThrow("PORT")),
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
};
