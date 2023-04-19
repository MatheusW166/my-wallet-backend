import { Router } from "express";
import { userController } from "./controllers/user.controller.js";

const router = Router();

router.post("/login", userController.logIn);
router.post("/register", userController.register);

export default router;
