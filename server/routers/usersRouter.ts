import { Router } from "express";
import { createNewUser, loginUser } from "../controllers/users";

const usersRouter = Router();

usersRouter.post("/", createNewUser);
usersRouter.post("/login", loginUser);

export default usersRouter;