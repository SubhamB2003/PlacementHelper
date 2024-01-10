import express from "express";
import { Login, Register } from "../controllers/auth.js";

const router = express.Router();

// CREATE
router.post("/register", Register);
router.post("/login", Login);

export default router;

