import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { parseCookies } from "../middleware";
import querystring from "querystring";
import fetch from 'node-fetch';
import jwkToPem from 'jwk-to-pem';
import * as dotenv from "dotenv";
import * as path from "path"
import { GOOGLE_OAUTH_URL } from "../middleware";

dotenv.config({path: path.resolve(process.cwd(), ".env")});

interface GoogleAuthResponse {
    id_token?: string;
    access_token?: string;
}

interface GoogleCert {
    kid: string;
    alg: string;
    use: string;
    e: string;
    kty: string;
    n: string;
}

interface GoogleCertsResponse {
    keys?: GoogleCert[];
}

export const googleAuth = async (req: Request, res: Response) => {
    const params = querystring.stringify({
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: 'email',
        access_type: 'offline',
        prompt: 'consent',
    })

    const googleAuthUrl = `${process.env.GOOGLE_AUTH_URL}?${params}`;
    res.redirect(googleAuthUrl);
};

export const checkCookie = async (req: Request, res: Response): Promise<void> => {
    
    const cookie = req.headers.cookie;
    
    if (!cookie || cookie.length === 0){
        res.status(401);
        return;
    }


    const { authToken, userInfo } = parseCookies(cookie); 

    if (!authToken){
        res.status(401);
    }

    try {
        // Step 1: Validate the token with Google
        const response = await fetch(`${GOOGLE_OAUTH_URL}${authToken}`);
        const data = await response.json();

        if (response.ok) {
            console.log('Token validated successfully:', data);
            res.json({ authenticated: true});
        } else {
            res.status(401);
        }
    } catch (error) {
        console.error('Token Verification Error: ', error.message);
        res.status(401);
    }
};


export const handleCallback = async (req: Request, res: Response) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Missing authorization code' });
    }

    try {
        // Exchange code for tokens
        const tokenEndpoint = process.env.GOOGLE_TOKEN_URL || 'https://oauth2.googleapis.com/token';
        const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code: code as string,
                client_id: process.env.CLIENT_ID!,
                client_secret: process.env.CLIENT_SECRET!,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
                grant_type: 'authorization_code',
            }).toString(),
        });

        const data: GoogleAuthResponse = await response.json();

        if (!response.ok) {
            return res.status(500).json({
                error: 'Failed to exchange code for tokens',
                details: data,
            });
        }

        const { id_token, access_token } = data;

        // Decode and verify the ID token
        const userPayload = await decodeAndVerifyToken(id_token) as JwtPayload;
        // Save tokens securely, e.g., using an HTTP-only cookie
        res.cookie('authToken', access_token, { httpOnly: true, secure: true, sameSite: "none", path: "/" });
        
        res.cookie('userInfo', JSON.stringify({ email: userPayload.email, name: userPayload.name }), {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });


        // Redirect or return success message
        res.redirect('https://vandy-courses-three.vercel.app');
    } catch (error: any) {
        console.error('Error during authentication:', error.message);
        res.status(500).json({ error: 'Authentication failed', details: error.message });
    }
};

async function decodeAndVerifyToken(idToken: string) {
    const googleCertsUrl = 'https://www.googleapis.com/oauth2/v3/certs';

    try {
        // Fetch Google's public keys
        const response = await fetch(googleCertsUrl);
        const certs: GoogleCertsResponse = await response.json();

        // Decode the ID token to get the 'kid' (Key ID) from the header
        const decodedHeader = jwt.decode(idToken, { complete: true })?.header;
        const kid = decodedHeader?.kid;

        if (!kid) {
            throw new Error('ID Token does not have a valid "kid" in its header');
        }

        // Find the public key that matches the 'kid'
        const publicKey = certs.keys.find((key: any) => key.kid === kid);

        if (!publicKey) {
            throw new Error('Public key not found for the "kid"');
        }

        // Convert the JWK to PEM format
        const pem = jwkToPem(publicKey);
        
        // Verify the ID token with the public key (in PEM format)
        const decodedToken = jwt.verify(idToken, pem, { algorithms: ['RS256'] });

        return decodedToken;
    } catch (error) {
        console.error('Error during token verification:', error);
        throw new Error('Invalid ID Token');
    }
}


