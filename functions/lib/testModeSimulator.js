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
exports.testModeSimulator = void 0;
const functions = __importStar(require("firebase-functions"));
exports.testModeSimulator = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Auth required.");
    }
    const { leadId, scenario } = data;
    // Scenarios match Agent B logic
    let transcript = "";
    let status = "completed";
    let analysis = {};
    switch (scenario) {
        case "success":
            transcript = "Yes, I would love to book a demo. How about Tuesday?";
            analysis = { successEvaluation: "true" };
            break;
        case "reject":
            transcript = "Not interested. Please remove me from your list.";
            break;
        case "no-answer":
            transcript = "Please leave a message after the tone.";
            status = "no-answer";
            break;
        case "warm":
            transcript = "Tell me more about your pricing... ".repeat(10); // Long conversation
            break;
        default:
            transcript = "Hello?";
    }
    // Construct Mock VAPI Payload
    const mockPayload = {
        message: {
            type: "end-of-call-report",
            callId: `mock-${Date.now()}`,
            status: status,
            durationSeconds: scenario === "warm" ? 350 : 45,
            transcript: transcript,
            summary: `Test simulation: ${scenario}`,
            recordingUrl: "https://mock-recording-url.com",
            analysis: analysis,
            metadata: {
                leadId: leadId
            },
            customer: {
                number: "+15550001234"
            }
        }
    };
    try {
        // Call our own webhook handler
        // Since we are inside the functions execution, calling its URL (localhost or deployed) is one way,
        // or we can extract the logic from webhookHandler into a shared function.
        // For simplicity in this "simulator", we'll just fire a fetch to the deployed local emulator URL or prod URL.
        // NOTE: In production, you'd use the actual URL of your function: `https://us-central1-[PROJECT].cloudfunctions.net/vapiWebhookHandler`
        // For this prompt, we'll assume the URL is configured or we just return the payload for the frontend to confirm it would "work".
        const project = process.env.GCLOUD_PROJECT || "apexvoicesolutions-fde4b";
        const region = "us-central1";
        const webhookUrl = `https://${region}-${project}.cloudfunctions.net/vapiWebhookHandler`;
        // In a real local dev environment, we might want to hit localhost 
        // const webhookUrl = "http://127.0.0.1:5001/..."
        console.log(`Simulating webhook to: ${webhookUrl}`);
        // await fetch(webhookUrl, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(mockPayload)
        // });
        return {
            success: true,
            message: "Simulation initiated. (Note: In a real deploy, this would hit the webhook endpoint)",
            mockPayload
        };
    }
    catch (error) {
        throw new functions.https.HttpsError("internal", error.message);
    }
});
//# sourceMappingURL=testModeSimulator.js.map