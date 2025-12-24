<<<<<<< HEAD
import "dotenv/config";

import express, { Request, Response } from "express";
import userRoutes from "./routes/userRoutes";
import { getDb } from "./db/mongo";
=======
import dotenv from "dotenv";
dotenv.config({ path: "src/process.env" });
import express, { Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
>>>>>>> e91022c (Add dotenv and JWT setup)

const app: express.Application = express();

const port: number = 3000;

app.use(express.json());

(async () => {
  const db = await getDb();
  await db.command({ ping: 1 });
  console.log("MongoDB ready");
})().catch((err) => {
  console.error("MongoDB connection failed:", err);
  process.exit(1);
});

app.get("/", (req: Request, res: Response) => {
  res.send("TypeScript With Express");
});

app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`TypeScript with Express http://localhost:${port}/`);
});

//npm start to start the server
//http://localhost:3000/
