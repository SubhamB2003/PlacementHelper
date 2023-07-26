import express from "express";
import {
    AddRemoveLike,
    commentUpdate,
    createComment,
    getFeedPosts, getUserPosts,
    postUpdate,
    removeComment,
    removePost,
    sharePost
} from "../controllers/post.js";
import { verifyToken } from "../middleware/ReqCheck.js";

const router = express.Router();

// CREATE
router.post("/comment", verifyToken, createComment);


// READ
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:postId", sharePost);


// UPDATE
router.patch("/", verifyToken, postUpdate);
router.patch("/:id/likes", verifyToken, AddRemoveLike);
router.patch("/comment", verifyToken, commentUpdate);


// REMOVE
router.delete("/:postId/removepost", verifyToken, removePost);
router.delete("/comment", verifyToken, removeComment);


export default router;