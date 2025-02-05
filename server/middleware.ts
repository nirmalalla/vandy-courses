import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IncomingHttpHeaders } from "http";

import * as dotenv from "dotenv";
import * as path from "path"
dotenv.config({path: path.resolve(process.cwd(), ".env")});

interface AuthenticatedHeaders extends IncomingHttpHeaders{
    authorization?: string
}

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
    headers?: AuthenticatedHeaders;
}

interface UserInfo {
  email: string;
}

const GOOGLE_OAUTH_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=';


function parseCookies(cookieString: string): {
  authToken: string;
  userInfo: UserInfo | null;
} {
  // Create an object to store the parsed values
  const cookies: { [key: string]: string } = {};

  // Split the cookie string by semicolons and parse each cookie
  cookieString.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    if (parts.length === 2) {
      const key = parts[0].trim();
      const value = parts[1].trim();
      cookies[key] = value;
    }
  });

  // Parse the userInfo JSON if it exists
  let userInfo: UserInfo | null = null;
  if (cookies.userInfo) {
    try {
      userInfo = JSON.parse(decodeURIComponent(cookies.userInfo));
    } catch (e) {
      console.error('Failed to parse userInfo:', e);
    }
  }

  return {
    authToken: cookies.authToken || '',
    userInfo
  };
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const cookie = req.headers.cookie;
    console.log(cookie);
    console.log(req.headers);
    
    if (!cookie || cookie.length === 0){
        res.status(401).json({error: "missing cookie"});
        return;
    }


    const { authToken, userInfo } = parseCookies(cookie); 
    if (!authToken){
        res.status(401).json({error: "missing token"});
    }

    try {
        // Step 1: Validate the token with Google
        const response = await fetch(`${GOOGLE_OAUTH_URL}${authToken}`);
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



