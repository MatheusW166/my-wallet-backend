import { Router } from "express";
import userController from "../controllers/user.controller.js";
import tokenMiddlewares from "../middlewares/token.middleware.js";

const userRoutes = Router();

userRoutes.post("/login", userController.logIn);
userRoutes.post("/register", userController.register);
userRoutes.get(
  "/user",
  tokenMiddlewares.validateToken,
  userController.getUserData
);

export default userRoutes;
