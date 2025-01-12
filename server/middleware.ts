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

const GOOGLE_PUBLIC_KEYS_URL = "https://www.googleapis.com/oauth2/v3/certs";

let cachedKeys: Record<string, string> = {};

export const getGooglesPublicKeys = async (): Promise<Record<string, string>> => {
    if (Object.keys(cachedKeys).length === 0){
        const response = await fetch(GOOGLE_PUBLIC_KEYS_URL);

        if (!response.ok){
            throw new Error(`Failed to fetch google public keys: ${response.statusText}`);
        }

        const data = await response.json();
        cachedKeys = data.keys.reduce(
            (keys: Record<string, string>, key: any) => {
                keys[key.kid] = key.x5c[0];
                return keys;
            },
            {}
        );
    }

    return cachedKeys;
}


export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Missing token"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const publicKeys = await getGooglesPublicKeys();
        const decodedHeader = jwt.decode(token, { complete: true}) as any;

        if (!decodedHeader || !decodedHeader.header.kid) {
            throw new Error("invalid token header");
        }

        const key = publicKeys[decodedHeader.header.kid];

        if (!key) {
            throw new Error("no matching public key found");
        }

        const verifiedPayload = jwt.verify(token, `-----BEGIN CERTIFICATE-----\n${key}\n-----END CERTIFICATE-----`, {
            algorithms: ['RS256'],
        }) as JwtPayload;

        req.user = verifiedPayload;
        next();
    } catch (error) {
        console.error('Token Verification Error: ', error.message);
        res.status(401).json({ error: "Unauthorized: Invalid token"});
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided."});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token." });
    }
}


