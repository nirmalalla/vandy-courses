import { Router } from "express";
import { googleAuth, handleCallback } from "../controllers/users";

const usersRouter = Router();

usersRouter.get("/auth/google", googleAuth);
usersRouter.get("/auth/google/callback", handleCallback);

export default usersRouter;