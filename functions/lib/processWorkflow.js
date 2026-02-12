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
exports.processWorkflow = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const sgMail = __importStar(require("@sendgrid/mail"));
const twilio_1 = require("twilio");
// Re-using logic or just implementing directly for this agent
async function executeEmailAction(action, leadData, leadId) {
    var _a;
    const API_KEY = process.env.SENDGRID_API_KEY || ((_a = functions.config().sendgrid) === null || _a === void 0 ? void 0 : _a.key);
    if (API_KEY) {
        sgMail.setApiKey(API_KEY);
        const msg = {
            to: leadData.email,
            from: process.env.SENDGRID_FROM_EMAIL || "noreply@apexvoicesolutions.org",
            subject: action.subject || "Notification",
            text: action.body || "Notification", // simplified
            // html: action.body
        };
        await sgMail.send(msg);
    }
}
async function executeSmsAction(action, leadData, leadId) {
    const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER;
    if (ACCOUNT_SID && AUTH_TOKEN && FROM_NUMBER && leadData.phone) {
        const client = new twilio_1.Twilio(ACCOUNT_SID, AUTH_TOKEN);
        await client.messages.create({
            body: action.message,
            from: FROM_NUMBER,
            to: leadData.phone,
        });
    }
}
exports.processWorkflow = functions.firestore
    .document("leads/{leadId}")
    .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const previousData = change.before.data();
    const leadId = context.params.leadId;
    const db = admin.firestore();
    // 1. Fetch Active Workflows
    const workflowsSnapshot = await db.collection("workflows").where("status", "==", "active").get();
    if (workflowsSnapshot.empty)
        return;
    const promises = workflowsSnapshot.docs.map(async (doc) => {
        const workflow = doc.data();
        // 2. Check Triggers
        let triggerMatch = false;
        if (workflow.trigger === "status_change") {
            if (newData.status !== previousData.status && newData.status === workflow.triggerValue) {
                triggerMatch = true;
            }
        }
        else if (workflow.trigger === "tag_added") {
            // check tags
            const newTags = newData.tags || [];
            const oldTags = previousData.tags || [];
            // if new tag contains workflow.triggerValue and old didn't
            if (newTags.includes(workflow.triggerValue) && !oldTags.includes(workflow.triggerValue)) {
                triggerMatch = true;
            }
        }
        if (!triggerMatch)
            return;
        // 3. Execute Actions
        console.log(`Executing workflow ${workflow.name} for lead ${leadId}`);
        for (const action of workflow.actions || []) {
            try {
                switch (action.type) {
                    case "send_email":
                        await executeEmailAction(action, newData, leadId);
                        break;
                    case "send_sms":
                        await executeSmsAction(action, newData, leadId);
                        break;
                    case "wait":
                        // Wait logic is complex in linear execution. 
                        // Typically handled by scheduling a future task or using Cloud Tasks.
                        // For now, we skip or assume immediate execution for MVP.
                        console.log("Wait action requested - implementing via Cloud Tasks in future.");
                        break;
                    case "update_field":
                        await change.after.ref.update({ [action.field]: action.value });
                        break;
                    case "add_tag":
                        await change.after.ref.update({
                            tags: admin.firestore.FieldValue.arrayUnion(action.tag)
                        });
                        break;
                }
            }
            catch (err) {
                console.error(`Error executing action ${action.type} in workflow ${doc.id}:`, err);
            }
        }
        // Log execution
        await db.collection("workflowLogs").add({
            workflowId: doc.id,
            leadId,
            triggeredAt: admin.firestore.FieldValue.serverTimestamp(),
            status: "success"
        });
    });
    await Promise.all(promises);
});
//# sourceMappingURL=processWorkflow.js.map