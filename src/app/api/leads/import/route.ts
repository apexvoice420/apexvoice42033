import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({ message: "Import endpoint managed by Railway backend." });
}
