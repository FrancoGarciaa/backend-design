import { Router } from "express";
import passport from "passport";
import { registerUser, loginUser, currentUser } from "../controllers/sessions.controller.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get(
"/current",
passport.authenticate("current", { session: false }),
currentUser
);

export default router;