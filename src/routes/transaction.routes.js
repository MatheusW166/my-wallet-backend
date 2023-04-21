import {
  createTransaction,
  deleteTransaction,
  editTransaction,
  listTransactions,
} from "../controllers/transaction.controller.js";
import { Router } from "express";
import validateToken from "../middlewares/token.middleware.js";
import validateSession from "../middlewares/session.middleware.js";
import validateSchema from "../middlewares/schema.middleware.js";
import { transactionSchema } from "../schemas/transaction.schema.js";

const transactionRoutes = Router();

transactionRoutes.use(validateToken);
transactionRoutes.use(validateSession);

transactionRoutes.delete("/transaction/:id", deleteTransaction);
transactionRoutes.get("/transaction", listTransactions);

transactionRoutes.post(
  "/transaction",
  validateSchema(transactionSchema),
  createTransaction
);
transactionRoutes.put(
  "/transaction/:id",
  validateSchema(transactionSchema),
  editTransaction
);

export default transactionRoutes;
