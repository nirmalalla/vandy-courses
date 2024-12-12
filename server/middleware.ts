import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({path: path.resolve(process.cwd(), ".env")});

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided."});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token." });
    }
}

