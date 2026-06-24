import express from "express";
import { sendDirectMessage, sendGroupMessages } from "../controllers/messageController.js";
import { checkFriendship, checkGroupMembership } from "../middlewares/friendMiddleware.js";

const router = express.Router();

router.post("/direct",checkFriendship,sendDirectMessage);
router.post("/group",checkGroupMembership,sendGroupMessages);

export default router;