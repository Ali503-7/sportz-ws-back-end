import http from "http";
import express, { Request, Response } from "express";
import { matchRouter } from "./routes/match";
import { attachWebSocketToServer } from "./ws-server";

const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express TS!");
});

app.use("/matches", matchRouter);

const { broadcastMatchCreated } = attachWebSocketToServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;

  console.log(`Server listening on ${baseUrl}`);
  console.log(`WS Server listening on ${baseUrl.replace("http", "ws")}/ws`);
});
