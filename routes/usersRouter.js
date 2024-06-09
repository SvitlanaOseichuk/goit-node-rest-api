import express from "express";

import UserController from "../controllers/userControllers.js"
import uploadMiddleware from "../middlewares/upload.js"
import authMiddleware from "../middlewares/auth.js";


const router = express.Router();

router.patch("/avatars", authMiddleware, uploadMiddleware.single("avatar"), UserController.changeAvatar);
router.get("/verify/:token", UserController.verifyEmail);
router.post("/verify", UserController.reverifyEmail);

export default router;