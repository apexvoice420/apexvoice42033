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
exports.sendEmail = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const sgMail = __importStar(require("@sendgrid/mail"));
exports.sendEmail = functions.https.onCall(async (data, context) => {
    var _a;
    // Authentication check
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Auth required.");
    }
    const { leadId, templateId, subject, body, personalizations } = data;
    const db = admin.firestore();
    // Initialize SendGrid
    const API_KEY = process.env.SENDGRID_API_KEY || ((_a = functions.config().sendgrid) === null || _a === void 0 ? void 0 : _a.key);
    if (!API_KEY) {
        throw new functions.https.HttpsError("failed-precondition", "SendGrid API Key missing.");
    }
    sgMail.setApiKey(API_KEY);
    try {
        // Fetch lead details if leadId is provided and we need email address
        let toEmail = data.to;
        let leadData = {};
        if (leadId) {
            const leadDoc = await db.collection("leads").doc(leadId).get();
            if (!leadDoc.exists) {
                throw new functions.https.HttpsError("not-found", "Lead not found");
            }
            leadData = leadDoc.data();
            toEmail = leadData.email;
        }
        if (!toEmail) {
            throw new functions.https.HttpsError("invalid-argument", "No recipient email provided.");
        }
        // Construct Email
        // Note: Use templateId for SendGrid dynamic templates, or subject/body for plain text/html
        const msg = {
            to: toEmail,
            from: process.env.SENDGRID_FROM_EMAIL || "noreply@apexvoicesolutions.org",
            customArgs: { leadId: leadId || "" },
        };
        if (templateId) {
            msg.templateId = templateId;
            msg.dynamicTemplateData = Object.assign(Object.assign({}, personalizations), { businessName: leadData.businessName, contactName: leadData.contactName });
        }
        else {
            msg.subject = subject || "Update from Apex Voice Solutions";
            msg.html = body || "<p>Hello, this is a message from Apex Voice Solutions.</p>";
            // Simple personalization replacement for body
            if (personalizations) {
                Object.keys(personalizations).forEach(key => {
                    msg.html = msg.html.replace(new RegExp(`{{${key}}}`, 'g'), personalizations[key]);
                });
            }
        }
        // Send
        await sgMail.send(msg);
        // Log to emailLogs
        if (leadId) {
            await db.collection("emailLogs").add({
                leadId,
                subject: subject || "Template: " + templateId,
                sentAt: admin.firestore.FieldValue.serverTimestamp(),
                status: "sent",
                // messageId could be retrieved from response if needed
            });
            // Update Timeline
            await db.collection("leads").doc(leadId).collection("activity").add({
                type: "email",
                title: "Email Sent",
                description: subject || `Template: ${templateId}`,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        return { success: true };
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new functions.https.HttpsError("internal", error.message);
    }
});
//# sourceMappingURL=sendEmail.js.map