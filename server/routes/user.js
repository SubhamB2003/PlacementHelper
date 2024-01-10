import express from "express";
import { AddRemoveSavedPost, getAllUser, getUser, getUserByEmail, updatePassword, updateUser, verifyUserToken } from "../controllers/user.js";
import { verifyToken } from "../middleware/ReqCheck.js";


const router = express.Router();

/* READ */
router.get("/", verifyToken, getAllUser);
router.get("/user/:userId", verifyToken, getUser);
router.get("/user/email/:email", getUserByEmail);
router.get("/user/verifytoken/:token", verifyUserToken);

/* UPDATE */
router.patch("/user/update/password", updatePassword);
router.patch("/user/:userId", verifyToken, updateUser);
router.patch("/user/:userId/:postId", verifyToken, AddRemoveSavedPost);


export default router;
