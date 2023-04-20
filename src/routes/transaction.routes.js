import { Router } from "express";
import tokenMiddlewares from "../middlewares/token.middleware.js";
import transactionController from "../controllers/transaction.controller.js";

const transactionRoutes = Router();

transactionRoutes.post(
  "/transaction",
  tokenMiddlewares.validateToken,
  transactionController.createTransaction
);
transactionRoutes.get(
  "/transaction",
  tokenMiddlewares.validateToken,
  transactionController.listTransactions
);

export default transactionRoutes;
