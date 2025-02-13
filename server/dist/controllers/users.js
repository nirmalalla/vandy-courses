"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const middleware_1 = require("../middleware");
const querystring_1 = __importDefault(require("querystring"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
const middleware_2 = require("../middleware");
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
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
const checkCookie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req.headers.cookie;
    if (!cookie || cookie.length === 0) {
        res.status(401);
        return;
    }
    const { authToken, userInfo } = (0, middleware_1.parseCookies)(cookie);
    if (!authToken) {
        res.status(401);
    }
    try {
        // Step 1: Validate the token with Google
        const response = yield (0, node_fetch_1.default)(`${middleware_2.GOOGLE_OAUTH_URL}${authToken}`);
        const data = yield response.json();
        if (response.ok) {
            console.log('Token validated successfully:', data);
            res.json({ authenticated: true });
        }
        else {
            res.status(401);
        }
    }
    catch (error) {
        console.error('Token Verification Error: ', error.message);
        res.status(401);
    }
});
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
        res.cookie('authToken', access_token, { httpOnly: true, secure: true, sameSite: "none", path: "/" });
        res.cookie('userInfo', JSON.stringify({ email: userPayload.email, name: userPayload.name }), {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        // Redirect or return success message
        res.redirect('https://vandy-courses-three.vercel.app');
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