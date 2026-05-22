import express, {type Application, type Request, type Response } from "express";
import { initDB } from "./db";

const app : Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended : true}));


initDB();

app.get("/", (req : Request, res : Response) => {

  res.status(200).json({
    message: "Dev Pulse Server",
    "author" : "Sara Rubaya",
  });
});
export default app