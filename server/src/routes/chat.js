import express from "express";
import { chatHandler } from "./controllers/chatController.js";

const router = express.Router();

router.post("/chat", chatHandler);

export default router;
