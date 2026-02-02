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
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncGoogleCalendar = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const googleapis_1 = require("googleapis");
exports.syncGoogleCalendar = functions.https.onCall(async (data, context) => {
    var _a, _b, _c, _d;
    if (!context.auth)
        throw new functions.https.HttpsError("unauthenticated", "Auth required.");
    const { eventType, eventData } = data;
    const db = admin.firestore();
    // 1. Setup Auth
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ((_a = functions.config().google) === null || _a === void 0 ? void 0 : _a.id);
    const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ((_b = functions.config().google) === null || _b === void 0 ? void 0 : _b.secret);
    const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || ((_c = functions.config().google) === null || _c === void 0 ? void 0 : _c.redirect_uri);
    const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || ((_d = functions.config().google) === null || _d === void 0 ? void 0 : _d.refresh_token); // Assume stored/retrieved
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
        throw new functions.https.HttpsError("failed-precondition", "Google Calendar config missing (Client ID, Secret or Refresh Token).");
    }
    const oauth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const calendar = googleapis_1.google.calendar({ version: "v3", auth: oauth2Client });
    try {
        if (eventType === "create") {
            const event = {
                summary: eventData.title,
                description: eventData.description,
                start: { dateTime: eventData.startTime }, // ISO string
                end: { dateTime: eventData.endTime },
            };
            // Add attendees if lead email is present
            // if (eventData.leadEmail) event.attendees = [{ email: eventData.leadEmail }];
            const res = await calendar.events.insert({
                calendarId: "primary",
                requestBody: event,
            });
            // Store ID to link
            if (eventData.leadId) {
                await db.collection("leads").doc(eventData.leadId).update({
                    nextMeetingEventId: res.data.id,
                    nextMeetingTime: eventData.startTime
                });
            }
            return { success: true, googleEventId: res.data.id };
        }
        else if (eventType === "delete") {
            // ... delete logic
            return { success: true };
        }
    }
    catch (error) {
        console.error("Google Calendar Sync Error:", error);
        throw new functions.https.HttpsError("internal", error.message);
    }
    return { success: false, message: "Unknown eventType" };
});
//# sourceMappingURL=syncGoogleCalendar.js.map