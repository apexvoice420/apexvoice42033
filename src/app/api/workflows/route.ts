import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, trigger_type, config } = body;

        if (!name || !trigger_type) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const docRef = await addDoc(collection(db, "workflows"), {
            name,
            trigger_type,
            config,
            status: "Active",
            createdAt: new Date().toISOString(),
            last_run: null
        });

        return NextResponse.json({
            message: "Workflow created",
            id: docRef.id
        });

    } catch (error) {
        console.error("Create workflow error:", error);
        return NextResponse.json(
            { error: "Failed to create workflow" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const q = query(collection(db, "workflows"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const workflows = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ workflows });
    } catch (error) {
        console.error("Fetch workflows error:", error);
        return NextResponse.json(
            { error: "Failed to fetch workflows" },
            { status: 500 }
        );
    }
}
