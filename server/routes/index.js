import express from "express";
import { login, register, loggedIn } from "../controllers/user.js";
import { createtodo, getalltodo, deletetodo } from "../controllers/lists.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/getalltodo", auth, getalltodo);
router.post("/createtodo", auth, createtodo);
router.post("/deletetodo", auth, deletetodo);
router.get("/loggedIn", loggedIn);
export default router;
