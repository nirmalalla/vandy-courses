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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const GOOGLE_OAUTH_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=';
function parseCookies(cookieString) {
    // Create an object to store the parsed values
    const cookies = {};
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
    let userInfo = null;
    if (cookies.userInfo) {
        try {
            userInfo = JSON.parse(decodeURIComponent(cookies.userInfo));
        }
        catch (e) {
            console.error('Failed to parse userInfo:', e);
        }
    }
    return {
        authToken: cookies.authToken || '',
        userInfo
    };
}
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req.headers.cookie;
    if (!cookie || cookie.length === 0) {
        res.status(401).json({ error: "missing cookie" });
        return;
    }
    const { authToken, userInfo } = parseCookies(cookie);
    if (!authToken) {
        res.status(401).json({ error: "missing token" });
    }
    try {
        // Step 1: Validate the token with Google
        const response = yield fetch(`${GOOGLE_OAUTH_URL}${authToken}`);
        const data = yield response.json();
        if (response.ok) {
            console.log('Token validated successfully:', data);
            next();
        }
        else {
            throw new Error('Invalid token');
        }
    }
    catch (error) {
        console.error('Token Verification Error: ', error.message);
        res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
});
exports.authenticate = authenticate;
//# sourceMappingURL=middleware.js.map