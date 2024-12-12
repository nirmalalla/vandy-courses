import { Router } from "express";
import { createNewUser, loginUser, refreshToken } from "../controllers/users";

const usersRouter = Router();

usersRouter.post("/", createNewUser);
usersRouter.post("/login", loginUser);
usersRouter.post("/refreshToken", refreshToken);

export default usersRouter;