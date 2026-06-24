import express from "express";
import { getMessages, createConversation, getConversations, markAsSeen } from "../controllers/conversationController.js";
import { checkFriendship } from "../middlewares/friendMiddleware.js";

const router = express.Router();

router.get("/",getConversations);
router.post("/",checkFriendship,createConversation);
router.get("/:conversationId/messages",getMessages);
router.patch("/:conversationId/seen",markAsSeen);

export default router;