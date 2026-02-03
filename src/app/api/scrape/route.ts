import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({ message: "Scraper endpoint managed by Railway backend." });
}
