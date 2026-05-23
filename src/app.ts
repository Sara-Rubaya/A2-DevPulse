import express, {type Application, type Request, type Response } from "express";
import { initDB } from "./db";
import cors from "cors";
import logger from "./middleware/logger";
import { authRoute } from "./modules/auth/auth.route";
import { issuesRoute } from "./modules/issues/issues.route";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app : Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);






app.get("/", (req : Request, res : Response) => {

  res.status(200).json({
    success: true,
    message: "Dev Pulse Server",
    "author" : "Sara Rubaya",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);


app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found.`,
  });
});

app.use(globalErrorHandler);
export default app