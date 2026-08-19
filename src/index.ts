import express, { Request, Response } from "express";

const app = express();
const PORT = 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express TS!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
