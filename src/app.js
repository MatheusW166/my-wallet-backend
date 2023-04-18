import express from "express";
import { config } from "dotenv";
import cors from "cors";
config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("<h1>Hello World</h1>"));

app.listen(process.env.PORT);
