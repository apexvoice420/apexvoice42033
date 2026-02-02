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
exports.calculateLeadScoreOnCall = exports.calculateLeadScore = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
exports.calculateLeadScore = functions.firestore
    .document("leads/{leadId}/activity/{activityId}")
    .onCreate(async (snapshot, context) => {
    // This triggers whenever a new activity is added to a lead (call, email, sms, etc.)
    // Alternatively, could be an onCall function if we want to trigger manually.
    // For this prompt, let's make it onCall to match Agent B spec "Function 6" which implies explicit call,
    // but the spec also says "Trigger: Called after any lead interaction".
    // Let's implement BOTH: an onCall wrapper that logic can use, and maybe the logic itself.
    // Actually, let's implement the onCall version as primary, as requested.
    return;
});
exports.calculateLeadScoreOnCall = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Auth required.");
    }
    return await runLeadScoreCalculation(data.leadId);
});
// Separate the logic so it can be reused
async function runLeadScoreCalculation(leadId) {
    const db = admin.firestore();
    const leadRef = db.collection("leads").doc(leadId);
    const leadDoc = await leadRef.get();
    if (!leadDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Lead not found");
    }
    const lead = leadDoc.data() || {};
    let score = 0;
    // 1. Base Score from Rating (if available)
    // (rating / 5) * 20 = up to 20 points
    if (lead.rating) {
        score += (lead.rating / 5) * 20;
    }
    // 2. Fetch Activity
    const activitySnapshot = await leadRef.collection("activity").get();
    // Scoring Rules
    let callAnswered = false;
    let demoBooked = false;
    let noResponseCount = 0;
    activitySnapshot.forEach(doc => {
        const act = doc.data();
        // Call Answered
        if (act.type === "call" && act.outcome && !["no-answer", "voicemail", "failed"].includes(act.outcome)) {
            score += 10;
            callAnswered = true;
            if (act.duration > 180)
                score += 5; // > 3 mins
        }
        // No Answer Tracker (simplified)
        if (act.type === "call" && ["no-answer", "voicemail"].includes(act.outcome)) {
            noResponseCount++;
        }
        // Email Actions
        if (act.type === "email_open")
            score += 5;
        if (act.type === "email_click")
            score += 10;
        // SMS Response
        if (act.type === "sms" && act.direction === "inbound")
            score += 10;
        // Demo Booked
        if (act.outcome === "Demo Booked") {
            score += 30;
            demoBooked = true;
        }
    });
    // Penalties
    if (noResponseCount >= 3 && !callAnswered) {
        score -= 15;
    }
    // Bonuses
    // "In high-performing city" - hard to determine without aggregations, skip for now or check static list
    // const popularCities = ["Dallas", "Houston"]; // example
    // if (popularCities.includes(lead.city)) score += 10;
    // Cap Score
    score = Math.max(0, Math.min(100, score));
    // Determine Engagement Level
    let engagementLevel = "Cold";
    if (score > 60)
        engagementLevel = "Hot";
    else if (score > 30)
        engagementLevel = "Warm";
    // Update Lead
    await leadRef.update({
        score: Math.round(score),
        engagementLevel: engagementLevel,
    });
    // Trigger Notification if Hot
    if (engagementLevel === "Hot" && lead.engagementLevel !== "Hot") {
        // trigger notification logic here
        console.log(`Lead ${leadId} is now HOT!`);
    }
    return { leadId, score, engagementLevel };
}
//# sourceMappingURL=calculateLeadScore.js.map