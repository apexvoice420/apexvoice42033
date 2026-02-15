import { NextResponse } from 'next/server';
import { fetchLeadsFromSheet } from '@/lib/googleSheets';

export async function GET() {
  const leads = await fetchLeadsFromSheet();
  return NextResponse.json({ leads, count: leads.length });
}
