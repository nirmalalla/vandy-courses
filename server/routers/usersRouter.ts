import { Router } from "express";
import { googleAuth, handleCallback, checkCookie } from "../controllers/users";

const usersRouter = Router();

usersRouter.get("/auth/google", googleAuth);
usersRouter.get("/auth/google/callback", handleCallback);
usersRouter.get("/auth/checkCookie", checkCookie);

export default usersRouter;