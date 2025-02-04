"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCallback = exports.checkCookie = exports.googleAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const querystring_1 = __importDefault(require("querystring"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
const googleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = querystring_1.default.stringify({
        client_id: process.env.CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: 'email',
        access_type: 'offline',
        prompt: 'consent',
    });
    const googleAuthUrl = `${process.env.GOOGLE_AUTH_URL}?${params}`;
    res.redirect(googleAuthUrl);
});
exports.googleAuth = googleAuth;
const checkCookie = (req, res) => {
    try {
        const cookies = req.headers.cookie;
        if (!cookies) {
            res.json({ authenticated: false });
            return;
        }
        // Convert cookies string to array and check for both required values
        const cookieArray = cookies.split(';').map(cookie => cookie.trim());
        const hasAuthToken = cookieArray.some(cookie => cookie.startsWith('authToken='));
        const hasUserInfo = cookieArray.some(cookie => cookie.startsWith('userInfo='));
        res.json({
            authenticated: hasAuthToken && hasUserInfo
        });
    }
    catch (error) {
        console.error('Cookie check error:', error);
        res.status(500).json({
            authenticated: false,
            error: 'Error checking authentication status'
        });
    }
};
exports.checkCookie = checkCookie;
const handleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    if (!code) {
        return res.status(400).json({ error: 'Missing authorization code' });
    }
    try {
        // Exchange code for tokens
        const tokenEndpoint = process.env.GOOGLE_TOKEN_URL || 'https://oauth2.googleapis.com/token';
        const response = yield (0, node_fetch_1.default)(tokenEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code: code,
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
            }).toString(),
        });
        const data = yield response.json();
        if (!response.ok) {
            return res.status(500).json({
                error: 'Failed to exchange code for tokens',
                details: data,
            });
        }
        const { id_token, access_token } = data;
        // Decode and verify the ID token
        const userPayload = yield decodeAndVerifyToken(id_token);
        // Save tokens securely, e.g., using an HTTP-only cookie
        res.cookie('authToken', access_token, { httpOnly: true, secure: true });
        res.cookie('userInfo', JSON.stringify({ email: userPayload.email, name: userPayload.name }), {
            httpOnly: true,
            secure: true,
        });
        // Redirect or return success message
        res.redirect('http://localhost:3000');
    }
    catch (error) {
        console.error('Error during authentication:', error.message);
        res.status(500).json({ error: 'Authentication failed', details: error.message });
    }
});
exports.handleCallback = handleCallback;
function decodeAndVerifyToken(idToken) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const googleCertsUrl = 'https://www.googleapis.com/oauth2/v3/certs';
        try {
            // Fetch Google's public keys
            const response = yield (0, node_fetch_1.default)(googleCertsUrl);
            const certs = yield response.json();
            // Decode the ID token to get the 'kid' (Key ID) from the header
            const decodedHeader = (_a = jsonwebtoken_1.default.decode(idToken, { complete: true })) === null || _a === void 0 ? void 0 : _a.header;
            const kid = decodedHeader === null || decodedHeader === void 0 ? void 0 : decodedHeader.kid;
            if (!kid) {
                throw new Error('ID Token does not have a valid "kid" in its header');
            }
            // Find the public key that matches the 'kid'
            const publicKey = certs.keys.find((key) => key.kid === kid);
            if (!publicKey) {
                throw new Error('Public key not found for the "kid"');
            }
            // Convert the JWK to PEM format
            const pem = (0, jwk_to_pem_1.default)(publicKey);
            // Verify the ID token with the public key (in PEM format)
            const decodedToken = jsonwebtoken_1.default.verify(idToken, pem, { algorithms: ['RS256'] });
            return decodedToken;
        }
        catch (error) {
            console.error('Error during token verification:', error);
            throw new Error('Invalid ID Token');
        }
    });
}
//# sourceMappingURL=users.js.map