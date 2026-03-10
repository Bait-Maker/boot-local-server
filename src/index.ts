import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
  errorMiddleware,
  middleWareLogResponses,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerResetHits } from "./api/reset.js";
import { handlerMetrics } from "./api/metrics.js";

import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerAddUser, handlerUpdateUser } from "./api/users.js";
import { handlerLogin, handlerRefresh, handlerRevoke } from "./api/auth.js";
import {
  handlerCreateChirp,
  handlerGetChirps,
  handlerGetChirpById,
} from "./api/chirps.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middleWareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", async (req, res, next) => {
  try {
    await handlerReadiness(req, res);
  } catch (err) {
    next(err);
  }
});
app.get("/admin/metrics", async (req, res, next) => {
  try {
    await handlerMetrics(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/api/chirps", async (req, res, next) => {
  try {
    await handlerGetChirps(req, res);
  } catch (err) {
    next(err);
  }
});

app.get("/api/chirps/:chirpId", async (req, res, next) => {
  try {
    await handlerGetChirpById(req, res);
  } catch (err) {
    next(err);
  }
});

app.post("/admin/reset", async (req, res, next) => {
  try {
    await handlerResetHits(req, res);
  } catch (err) {
    return next(err);
  }
});
app.post("/api/chirps", async (req, res, next) => {
  try {
    await handlerCreateChirp(req, res);
  } catch (err) {
    return next(err);
  }
});

app.post("/api/users", async (req, res, next) => {
  try {
    await handlerAddUser(req, res);
  } catch (err) {
    return next(err);
  }
});

app.post("/api/login", async (req, res, next) => {
  try {
    await handlerLogin(req, res);
  } catch (err) {
    return next(err);
  }
});

app.post("/api/refresh", async (req, res, next) => {
  try {
    await handlerRefresh(req, res);
  } catch (err) {
    return next(err);
  }
});

app.post("/api/revoke", async (req, res, next) => {
  try {
    await handlerRevoke(req, res);
  } catch (err) {
    return next(err);
  }
});

app.put("/api/users", async (req, res, next) => {
  try {
    await handlerUpdateUser(req, res);
  } catch (err) {
    return next(err);
  }
});

app.use(errorMiddleware);

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
