import { NextResponse } from 'next/server';

export async function POST() {
    return new Response('Legacy booking API deprecated. Use Railway backend.', { status: 410 });
}
