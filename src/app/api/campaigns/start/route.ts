import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, script } = body;

        if (!name || !script) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const docRef = await addDoc(collection(db, "campaigns"), {
            name,
            script,
            status: "Active",
            createdAt: new Date().toISOString(),
            stats: {
                calls: 0,
                booked: 0
            }
        });

        return NextResponse.json({
            message: "Campaign created",
            id: docRef.id
        });

    } catch (error) {
        console.error("Campaign error:", error);
        return NextResponse.json(
            { error: "Failed to create campaign" },
            { status: 500 }
        );
    }
}
