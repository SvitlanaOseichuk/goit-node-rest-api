import express from "express";

import UserController from "../controllers/userControllers.js"
import uploadMiddleware from "../middlewares/upload.js"

const router = express.Router();

router.patch("/avatars", uploadMiddleware.single("avatar"), UserController.changeAvatar)

export default router;