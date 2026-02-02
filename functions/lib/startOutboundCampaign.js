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
exports.startOutboundCampaign = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
exports.startOutboundCampaign = functions.https.onCall(async (data, context) => {
    var _a, _b;
    // Ensure user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "The function must be called while authenticated.");
    }
    const db = admin.firestore();
    const { campaignId, batchSize = 10, filters } = data;
    try {
        // 1. Build Query
        let query = db.collection("leads").where("status", "==", "New Lead");
        // Apply filters if provided
        if (filters === null || filters === void 0 ? void 0 : filters.city)
            query = query.where("city", "==", filters.city);
        if (filters === null || filters === void 0 ? void 0 : filters.state)
            query = query.where("state", "==", filters.state);
        if (filters === null || filters === void 0 ? void 0 : filters.niche)
            query = query.where("niche", "==", filters.niche);
        // Note: 'tags' array-contains requires a separate query or client-side filtering if composite indexes aren't ready
        // For now, we'll keep it simple.
        // Limit batch size
        const leadsSnapshot = await query.limit(batchSize).get();
        if (leadsSnapshot.empty) {
            return { success: true, callsInitiated: 0, message: "No new leads found matching criteria." };
        }
        const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID || ((_a = functions.config().vapi) === null || _a === void 0 ? void 0 : _a.assistant_id);
        const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY || ((_b = functions.config().vapi) === null || _b === void 0 ? void 0 : _b.private_key);
        if (!VAPI_ASSISTANT_ID || !VAPI_PRIVATE_KEY) {
            throw new functions.https.HttpsError("failed-precondition", "VAPI configuration missing.");
        }
        let callsInitiated = 0;
        const errors = [];
        // 2. Process Batch
        const promises = leadsSnapshot.docs.map(async (doc) => {
            const lead = doc.data();
            const leadId = doc.id;
            // Skip invalid phones
            if (!lead.phone)
                return;
            try {
                // 3. Call VAPI
                // We use fetch here (node 18+) or install node-fetch if needed. 
                // Firebase functions node 18 has global fetch.
                const response = await fetch("https://api.vapi.ai/call/phone", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${VAPI_PRIVATE_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        phoneNumber: lead.phone,
                        assistantId: VAPI_ASSISTANT_ID,
                        customer: {
                            name: lead.businessName,
                            number: lead.phone,
                        },
                        metadata: {
                            leadId: leadId,
                            campaignId: campaignId,
                        },
                    }),
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`VAPI Error: ${response.status} ${errorText}`);
                }
                const callData = await response.json();
                // 4. Update Lead Status
                await doc.ref.update({
                    status: "Called - Awaiting Response",
                    lastContactedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                // 5. Create Call Log
                await db.collection("callLogs").add({
                    leadId,
                    campaignId,
                    vapiCallId: callData.id,
                    initiatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    status: "pending",
                    direction: "outbound",
                });
                callsInitiated++;
                // 6. Update Campaign Stats
                if (campaignId) {
                    await db.collection("campaigns").doc(campaignId).update({
                        callsInitiated: admin.firestore.FieldValue.increment(1),
                        status: "active"
                    });
                }
            }
            catch (err) {
                console.error(`Failed to call lead ${leadId}:`, err);
                errors.push({ leadId, error: err.message });
                // Optionally update lead to "Error" status
            }
        });
        await Promise.all(promises);
        return {
            success: true,
            callsInitiated,
            failed: errors.length,
            errors
        };
    }
    catch (error) {
        console.error("Error in startOutboundCampaign:", error);
        throw new functions.https.HttpsError("internal", error.message);
    }
});
//# sourceMappingURL=startOutboundCampaign.js.map