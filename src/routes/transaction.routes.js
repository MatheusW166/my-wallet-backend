import { Router } from "express";
import tokenMiddlewares from "../middlewares/token.middleware.js";
import transactionController from "../controllers/transaction.controller.js";

const transactionRoutes = Router();

transactionRoutes.post(
  "/transaction",
  tokenMiddlewares.validateToken,
  transactionController.createTransaction
);
transactionRoutes.put(
  "/transaction/:id",
  tokenMiddlewares.validateToken,
  transactionController.editTransaction
);
transactionRoutes.delete(
  "/transaction/:id",
  tokenMiddlewares.validateToken,
  transactionController.deleteTransaction
);
transactionRoutes.get(
  "/transaction",
  tokenMiddlewares.validateToken,
  transactionController.listTransactions
);

export default transactionRoutes;
