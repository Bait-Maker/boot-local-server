import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
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

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerResetHits);
app.post("/api/validate_chirp", handlerValidateChirp);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
