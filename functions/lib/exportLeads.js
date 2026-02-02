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
exports.exportLeads = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const Papa = __importStar(require("papaparse"));
exports.exportLeads = functions.runWith({ timeoutSeconds: 300, memory: "1GB" }).https.onCall(async (data, context) => {
    if (!context.auth)
        throw new functions.https.HttpsError("unauthenticated", "Auth required.");
    const { filters, includeActivityHistory } = data;
    const db = admin.firestore();
    // 1. Query Leads
    let query = db.collection("leads").limit(1000); // capped for safety
    if (filters === null || filters === void 0 ? void 0 : filters.status)
        query = query.where("status", "==", filters.status);
    if (filters === null || filters === void 0 ? void 0 : filters.city)
        query = query.where("city", "==", filters.city);
    // ... add other filters
    const snapshot = await query.get();
    const leads = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, doc.data())));
    // 2. Format CSV
    const csv = Papa.unparse(leads);
    // 3. Upload to Storage
    const bucket = admin.storage().bucket();
    const fileName = `exports/leads_export_${Date.now()}.csv`;
    const file = bucket.file(fileName);
    await file.save(csv, {
        contentType: "text/csv",
        metadata: {
            metadata: {
                firebaseStorageDownloadTokens: fileName // simplistic token
            }
        }
    });
    // 4. Get Signed URL
    const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60, // 1 hour
    });
    return { downloadUrl: url, count: leads.length };
});
//# sourceMappingURL=exportLeads.js.map