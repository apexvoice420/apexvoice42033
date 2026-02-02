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
exports.sendSMS = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const twilio_1 = require("twilio");
exports.sendSMS = functions.https.onCall(async (data, context) => {
    var _a, _b, _c;
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Auth required.");
    }
    const { leadId, message, scheduledFor } = data;
    const db = admin.firestore();
    const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || ((_a = functions.config().twilio) === null || _a === void 0 ? void 0 : _a.sid);
    const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || ((_b = functions.config().twilio) === null || _b === void 0 ? void 0 : _b.token);
    const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER || ((_c = functions.config().twilio) === null || _c === void 0 ? void 0 : _c.phone);
    if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM_NUMBER) {
        throw new functions.https.HttpsError("failed-precondition", "Twilio configuration missing.");
    }
    const client = new twilio_1.Twilio(ACCOUNT_SID, AUTH_TOKEN);
    try {
        // Fetch lead
        const leadDoc = await db.collection("leads").doc(leadId).get();
        if (!leadDoc.exists) {
            throw new functions.https.HttpsError("not-found", "Lead not found");
        }
        const leadData = leadDoc.data();
        if (!(leadData === null || leadData === void 0 ? void 0 : leadData.phone)) {
            throw new functions.https.HttpsError("failed-precondition", "Lead has no phone number.");
        }
        // Check DNC/Opt-out logic would go here (query smsOptOuts collection)
        // Compliance Body
        const fullBody = `${message}\n\nReply STOP to opt out.`;
        // Send SMS
        const messageResult = await client.messages.create({
            body: fullBody,
            from: FROM_NUMBER,
            to: leadData.phone,
            // messagingServiceSid: ... if using a messaging service
        });
        // Log
        await db.collection("smsLogs").add({
            leadId,
            body: message,
            sid: messageResult.sid,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            status: messageResult.status
        });
        // Update Timeline
        await db.collection("leads").doc(leadId).collection("activity").add({
            type: "sms",
            title: "SMS Sent",
            description: message,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true, sid: messageResult.sid };
    }
    catch (error) {
        console.error("Error sending SMS:", error);
        throw new functions.https.HttpsError("internal", error.message);
    }
});
//# sourceMappingURL=sendSMS.js.map