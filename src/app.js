import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(userRoutes);
app.use(transactionRoutes);

const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => console.log(`Running at ${PORT}`));
