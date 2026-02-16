import { NextResponse } from 'next/server'

export async function GET() {
  // Test without Prisma first
  return NextResponse.json([
    {
      id: 1,
      businessName: 'Test Lead 1',
      phone: '+1555000001',
      city: 'Atlanta',
      status: 'New Lead'
    },
    {
      id: 2,
      businessName: 'Test Lead 2',
      phone: '+1555000002',
      city: 'Miami',
      status: 'Contacted'
    }
  ])
}
