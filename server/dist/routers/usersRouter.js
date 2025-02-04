"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const usersRouter = (0, express_1.Router)();
usersRouter.get("/auth/google", users_1.googleAuth);
usersRouter.get("/auth/google/callback", users_1.handleCallback);
usersRouter.get("/auth/checkCookie", users_1.checkCookie);
exports.default = usersRouter;
//# sourceMappingURL=usersRouter.js.map