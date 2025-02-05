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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
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
    console.log(cookie);
    console.log(req.headers);
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