import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({ message: "Voice endpoint managed by Railway backend." });
}
