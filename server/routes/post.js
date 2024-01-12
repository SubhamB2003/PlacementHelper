import express from "express";
import { AddRemoveLike, commentUpdate, createComment, createPost, getFeedPosts, getUserPosts, postUpdate, removeComment, removePost, sharePost } from "../controllers/post.js";
import { verifyToken } from "../middleware/ReqCheck.js";

const router = express.Router();

// CREATE
router.post("/post", verifyToken, createPost);
router.post("/post/comment", verifyToken, createComment);


// READ
router.get("/:sortOrder", verifyToken, getFeedPosts);
router.get("/:userSortOrder/:userId", verifyToken, getUserPosts);
router.get("/post/share/:postId", sharePost);


// UPDATE
router.patch("/post", verifyToken, postUpdate);
router.patch("/post/react/:postId", verifyToken, AddRemoveLike);
router.patch("/post/comment", verifyToken, commentUpdate);


// REMOVE
router.delete("/post/:postId", verifyToken, removePost);
router.delete("/post/comment/:cmtId", verifyToken, removeComment);


export default router;