import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "node:path";

import "./db/db.js";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js"
import userRouter from "./routes/usersRouter.js"
import authMiddleware from "./middlewares/auth.js"


const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/avatars", express.static(path.resolve("public/avatars")));

app.use("/api/contacts", authMiddleware, contactsRouter);
app.use("/users", authRouter);
app.use("/users", authMiddleware, userRouter)

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
