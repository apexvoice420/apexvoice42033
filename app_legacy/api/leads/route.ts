import { NextResponse } from 'next/server';

export async function GET() { return NextResponse.json({ offline: true }); }
export async function POST() { return NextResponse.json({ offline: true }); }
export async function PUT() { return NextResponse.json({ offline: true }); }
