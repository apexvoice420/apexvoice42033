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
exports.vapiWebhookHandler = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
exports.vapiWebhookHandler = functions.https.onRequest(async (req, res) => {
    var _a, _b;
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    const db = admin.firestore();
    const payload = req.body;
    // VAPI Webhook Interface (simplified)
    // payload.message.type tells us the event type: "function-call", "status-update", "end-of-call-report"
    const messageType = (_a = payload.message) === null || _a === void 0 ? void 0 : _a.type;
    console.log("Received VAPI Webhook:", messageType, JSON.stringify(payload).substring(0, 200));
    try {
        if (messageType === "end-of-call-report") {
            const callReport = payload.message;
            const metadata = callReport.metadata || {}; // leadId, campaignId
            const leadId = metadata.leadId;
            const transcript = callReport.transcript || "";
            const summary = callReport.summary || ""; // VAPI often provides a summary
            const analysis = callReport.analysis || {}; // If VAPI analysis is enabled
            const status = callReport.status; // "completed", etc.
            if (leadId) {
                const leadRef = db.collection("leads").doc(leadId);
                let newStatus = "Called - Actions Needed";
                let leadScoreDelta = 0;
                const transcriptLower = transcript.toLowerCase();
                // --- Logic Engine ---
                // 1. Success / Booked
                if (transcriptLower.includes("interested") ||
                    transcriptLower.includes("book") ||
                    transcriptLower.includes("schedule") ||
                    analysis.successEvaluation === "true" // If VAPI analysis says success
                ) {
                    newStatus = "Demo Booked";
                    leadScoreDelta = 30;
                    // Trigger Google Calendar Sync (placeholder)
                    // await syncGoogleCalendar({ leadId, ... });
                }
                // 2. Reject / DNC
                else if (transcriptLower.includes("not interested") ||
                    transcriptLower.includes("stop calling") ||
                    transcriptLower.includes("remove me")) {
                    newStatus = "Not Interested";
                    // Add to DNC
                    await db.collection("dncList").add({
                        phone: (_b = callReport.customer) === null || _b === void 0 ? void 0 : _b.number,
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                }
                // 3. No Answer / Voicemail
                else if (status === "no-answer" || transcriptLower.includes("voicemail")) {
                    newStatus = "Retry";
                    // Increment retry logic handled by scheduled jobs or manual retry
                }
                // 4. Warm Lead (Long duration)
                else if (callReport.durationSeconds > 300) { // 5 mins
                    newStatus = "Warm Lead";
                    leadScoreDelta = 20;
                }
                // --- Updates ---
                // Update Lead
                await leadRef.update({
                    status: newStatus,
                    score: admin.firestore.FieldValue.increment(leadScoreDelta),
                    lastInteraction: "VAPI Call",
                    lastInteractionAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                // Add Activity Timeline Entry
                await db.collection("leads").doc(leadId).collection("activity").add({
                    type: "call",
                    title: `VAPI Call: ${status}`,
                    description: summary || "Call completed",
                    outcome: newStatus,
                    transcript: transcript,
                    recordingUrl: callReport.recordingUrl || null,
                    duration: callReport.durationSeconds,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                // Save Call Log (Compliance)
                await db.collection("callLogs").add({
                    leadId,
                    vapiCallId: callReport.callId,
                    transcript,
                    summary,
                    recordingUrl: callReport.recordingUrl || null,
                    duration: callReport.durationSeconds,
                    outcome: newStatus,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    rawReport: callReport
                });
            }
        }
        res.status(200).send("Processed");
    }
    catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).send("Internal Server Error");
    }
});
//# sourceMappingURL=vapiWebhookHandler.js.map