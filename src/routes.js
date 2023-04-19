import { Router } from "express";
import userController from "./controllers/user.controller.js";
import transactionController from "./controllers/transaction.controller.js";
import tokenMiddlewares from "./middlewares/token.middleware.js";

const router = Router();

// User
router.post("/login", userController.logIn);
router.post("/register", userController.register);

// Transaction
router.post(
  "/transaction",
  tokenMiddlewares.validateToken,
  transactionController.createTransaction
);

export default router;
