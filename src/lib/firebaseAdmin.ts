
import "server-only";
// import type { Firestore } from 'firebase-admin/firestore';
type Firestore = any;

// Basic in-memory store for development testing
const MOCK_LEADS = [
    { id: '1', businessName: "Apex Plumbing", status: 'New', niche: 'Plumbing', phone: '+15125550101', city: 'Austin', website: 'apexplumbing.com' },
    { id: '2', businessName: "Reliable Roofers", status: 'Called', niche: 'Roofing', phone: '+15125550102', city: 'Round Rock', website: 'reliableroofers.com' },
    { id: '3', businessName: "City HVAC", status: 'Booked', niche: 'HVAC', phone: '+15125550103', city: 'Georgetown', website: 'cityhvac.com' },
    { id: '4', businessName: "Texan Electric", status: 'New', niche: 'Electrician', phone: '+15125550104', city: 'Austin', website: 'texanelectric.com' },
    { id: '5', businessName: "Modern Siding", status: 'Lost', niche: 'Siding', phone: '+15125550105', city: 'Pflugerville', website: 'modernsiding.com' }
];

function createMockDb(): Firestore {
    // Simple state simulation
    let currentLeads = [...MOCK_LEADS];

    return {
        collection: (name: string) => ({
            get: async () => ({
                docs: currentLeads.map(lead => ({
                    id: lead.id,
                    data: () => lead
                }))
            }),
            doc: (id?: string) => ({
                set: async (data: any) => {
                    console.log('Mock Set:', data);
                    // Update if exists, else push
                    const idx = currentLeads.findIndex(l => l.id === id);
                    if (idx >= 0) currentLeads[idx] = { ...currentLeads[idx], ...data };
                    else currentLeads.push({ id: id || 'new', ...data });
                },
                update: async (data: any) => {
                    console.log('Mock Update:', data);
                    const idx = currentLeads.findIndex(l => l.id === id);
                    if (idx >= 0) currentLeads[idx] = { ...currentLeads[idx], ...data };
                },
                get: async () => ({ exists: true, data: () => currentLeads.find(l => l.id === id) }),
            }),
            add: async (data: any) => {
                const newLead = { id: Math.random().toString(36), ...data };
                currentLeads.push(newLead);
                return newLead;
            },
        }),
    } as unknown as Firestore;
}

export function getDb(): Firestore {
    // Prevent build crashes by skipping native module load during build
    if (process.env.SKIP_FIREBASE === 'true') {
        console.warn("Skipping Firebase init (SKIP_FIREBASE set).");
        return createMockDb();
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // Handle newlines in private key for Vercel/Env compatibility
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    // Interactive check: If no credentials, we can't really do anything useful.
    // But to avoid crashing the dev server loop if user hasn't set them yet:
    if (!projectId || !clientEmail || !privateKey) {
        const msg = "Firebase Admin credentials not fully configured in .env.local.";
        if (process.env.NODE_ENV === 'development') {
            console.warn(msg + " Returning mock DB.");
            return createMockDb();
        }
        // In production, we probably want to crash or throw hard.
        throw new Error(msg);
    }

    try {
        // Lazy load native modules
        const { getApps, initializeApp, cert } = require('firebase-admin/app');
        const { getFirestore } = require('firebase-admin/firestore');

        if (getApps().length === 0) {
            initializeApp({
                credential: cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
        }

        return getFirestore();
        // console.warn("Using MOCK DB due to build constraints");
        // return createMockDb();
    } catch (error) {
        console.error("Failed to load/init firebase-admin:", error);
        // Fallback to avoid process crash if possible, but usually fatal.
        throw error;
    }
}
