import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
  errorMiddleware,
  middleWareLogResponses,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerResetHits, handlerMetrics } from "./api/metrics.js";
import { handlerValidateChirp } from "./api/validate_chirp.js";

const app = express();
const PORT = 8080;

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
app.post("/admin/reset", async (req, res, next) => {
  try {
    await handlerResetHits(req, res);
  } catch (err) {
    return next(err);
  }
});
app.post("/api/validate_chirp", async (req, res, next) => {
  try {
    await handlerValidateChirp(req, res);
  } catch (err) {
    return next(err);
  }
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
