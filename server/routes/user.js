import express from "express";
import { AddRemoveSavedPost, getAllUser, getUser, getUserByEmail, updatePassword, verifyUserToken } from "../controllers/user.js";
import { verifyToken } from "../middleware/ReqCheck.js";


const router = express.Router();

/* READ */
router.get("/", verifyToken, getAllUser);
router.get("/:id", getUser);
router.get("/user/:email", getUserByEmail);
router.get("/forgotpassword/verifytoken/:token", verifyUserToken);

/* UPDATE */
router.patch("/:userId/:postId", AddRemoveSavedPost);
router.patch("/forgotpassword", updatePassword);

export default router;
