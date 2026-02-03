import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, writeBatch, doc } from "firebase/firestore";
import Papa from "papaparse";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const text = await file.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        const rows = parsed.data as any[];

        if (rows.length === 0) {
            return NextResponse.json({ error: "Empty CSV file" }, { status: 400 });
        }

        const batch = writeBatch(db);
        const leadsRef = collection(db, "leads");
        let count = 0;

        for (const row of rows) {
            // Map CSV columns to Lead model
            const leadData = {
                businessName: row["Business Name"] || row["name"] || "Unknown Business",
                phone: row["Phone"] || row["phone"] || "",
                email: row["Email"] || row["email"] || "",
                city: row["City"] || row["city"] || "",
                status: "New Lead",
                createdAt: new Date().toISOString(),
                source: "CSV Import"
            };

            const newDocRef = doc(leadsRef);
            batch.set(newDocRef, leadData);
            count++;
        }

        await batch.commit();

        return NextResponse.json({
            message: "Import successful",
            count: count
        });

    } catch (error) {
        console.error("Import error:", error);
        return NextResponse.json(
            { error: "Failed to process import" },
            { status: 500 }
        );
    }
}
