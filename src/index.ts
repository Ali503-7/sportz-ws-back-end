import express, { Request, Response } from "express";
import { matchRouter } from "./routes/match";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express TS!");
});

app.use("/matches", matchRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
