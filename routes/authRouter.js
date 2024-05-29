import express from "express";

import AuthController from "../controllers/authController.js";
import authMiddleware from "../middlewares/auth.js"


const router = express.Router();
const jsonParser = express.json();

router.post("/register", jsonParser, AuthController.register);
router.post("/login", jsonParser, AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);
router.get("/current", authMiddleware, AuthController.current)

export default router;