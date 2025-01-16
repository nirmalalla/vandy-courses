import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IncomingHttpHeaders } from "http";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({path: path.resolve(process.cwd(), ".env")});
interface AuthenticatedHeaders extends IncomingHttpHeaders{
    authorization?: string
}

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
    headers?: AuthenticatedHeaders;
}

const GOOGLE_OAUTH_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=';

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const cookie = req.headers.cookie;

    if (!cookie || !cookie.includes("authToken")) {
        return res.status(401).json({ error: "Unauthorized: Missing token" });
    }

    const token = cookie.substring(cookie.indexOf("authToken") + 10, cookie.indexOf(";"));

    try {
        // Step 1: Validate the token with Google
        const response = await fetch(`${GOOGLE_OAUTH_URL}${token}`);
        const data = await response.json();

        if (response.ok) {
            console.log('Token validated successfully:', data);
            next();
        } else {
            throw new Error('Invalid token');
        }
    } catch (error) {
        console.error('Token Verification Error: ', error.message);
        res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};



