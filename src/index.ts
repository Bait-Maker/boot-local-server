import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
  middleWareLogResponses,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerResetHits, handlerMetrics } from "./api/metrics.js";

const app = express();
const PORT = 8080;

app.use(middleWareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/api/metrics", handlerMetrics);
app.get("/api/reset", handlerResetHits);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
