import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import * as path from "path";
import querystring from "querystring";
import fetch from 'node-fetch';
import jwkToPem from 'jwk-to-pem';

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
        const userPayload = await decodeAndVerifyToken(id_token);
        // Save tokens securely, e.g., using an HTTP-only cookie
        res.cookie('authToken', access_token, { httpOnly: true, secure: true });
        
        res.cookie('userInfo', JSON.stringify({ email: userPayload.email, name: userPayload.name }), {
            httpOnly: true,
            secure: true,
        });


        // Redirect or return success message
        res.redirect('http://localhost:3000/post');
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


