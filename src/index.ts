import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
  middleWareLogResponses,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerResetHits, handlerServerHits } from "./api/serverHits.js";

const app = express();
const PORT = 8080;

app.use(middlewareMetricsInc);
app.use("/app", express.static("./src/app"), middleWareLogResponses);

app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerServerHits);
app.get("/reset", handlerResetHits);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
