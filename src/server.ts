import express, {
     type Application,
      type Request,
       type Response
     } from "express"
     import {Pool} from "pg";
import config from "./config"
const app: Application = express();
const port = config.port;

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());

const pool = new Pool({
    connectionString : "postgresql://neondb_owner:npg_Md3S8zsiEonm@ep-patient-mountain-apnvggn9-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const initDB = async()=>{
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(100) UNIQUE NOT NULL,
        password    TEXT NOT NULL,
        role        VARCHAR(20) NOT NULL DEFAULT 'contributor'
                      CHECK (role IN ('contributor', 'maintainer')),
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      )
            `)
            console.log("Database connected successfully!");
    } catch (error) {
        console.log(error);
    }
};
initDB();

app.get('/', (req : Request, res : Response) => {
  res.status(200).json({
    message : "Dev Pulse Server",
    "author" : "Sara Rubaya"
  });
});
app.post("/",async(req : Request, res : Response)=>{
    console.log(req.body);
});

app.listen(port, () => {
  console.log(`DevPulse server listening on port ${port}`)
})