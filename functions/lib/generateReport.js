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
exports.generateReport = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
exports.generateReport = functions.runWith({ timeoutSeconds: 300 }).https.onCall(async (data, context) => {
    if (!context.auth)
        throw new functions.https.HttpsError("unauthenticated", "Auth required.");
    const { reportType, dateRange } = data;
    const db = admin.firestore();
    // Mock data generation for now, real aggregation requires aggregation queries or client-side calc
    // "Pipeline Report"
    let reportData = {};
    if (reportType === "pipeline") {
        const snapshot = await db.collection("leads").get(); // potentially large! use count aggregations in Node18+
        // const countSnapshot = await db.collection("leads").count().get(); // better for total
        const counts = { New: 0, Called: 0, Booked: 0, Lost: 0 };
        snapshot.forEach((doc) => {
            const s = doc.data().status;
            if (s && counts[s] !== undefined)
                counts[s]++;
            else if (s && s.includes("Called"))
                counts.Called++;
            else if (s && s.includes("Booked"))
                counts.Booked++;
        });
        reportData = { funnel: counts };
    }
    else if (reportType === "calls") {
        // Query callLogs
        reportData = { message: "Call report aggregation unavailable in MVP without BigQuery" };
    }
    return {
        downloadUrl: null,
        data: reportData,
        message: "PDF generation pending implementation. Viewing raw data."
    };
});
//# sourceMappingURL=generateReport.js.map