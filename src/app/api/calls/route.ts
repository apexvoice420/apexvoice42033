import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/calls - Fetch calls
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    if (leadId) where.leadId = parseInt(leadId)

    const calls = await prisma.call.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { lead: true }
    })

    return NextResponse.json(calls)
  } catch (error) {
    console.error('Error fetching calls:', error)
    return NextResponse.json({ error: 'Failed to fetch calls' }, { status: 500 })
  }
}

// POST /api/calls - Create a call record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const call = await prisma.call.create({
      data: {
        leadId: body.leadId,
        vapiCallId: body.vapiCallId,
        phoneNumber: body.phoneNumber,
        duration: body.duration,
        status: body.status,
        outcome: body.outcome,
        transcript: body.transcript,
        completedAt: body.completedAt ? new Date(body.completedAt) : undefined
      },
      include: { lead: true }
    })

    // Update lead's lastCalledAt
    await prisma.lead.update({
      where: { id: body.leadId },
      data: { lastCalledAt: new Date() }
    })

    return NextResponse.json(call, { status: 201 })
  } catch (error) {
    console.error('Error creating call:', error)
    return NextResponse.json({ error: 'Failed to create call' }, { status: 500 })
  }
}
