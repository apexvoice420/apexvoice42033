import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/stats - Dashboard statistics
export async function GET() {
  try {
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      demoBooked,
      closedWon,
      totalCalls,
      avgDuration
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'New Lead' } }),
      prisma.lead.count({ where: { status: 'Contacted' } }),
      prisma.lead.count({ where: { status: 'Qualified' } }),
      prisma.lead.count({ where: { status: 'Demo Booked' } }),
      prisma.lead.count({ where: { status: 'Closed Won' } }),
      prisma.call.count(),
      prisma.call.aggregate({
        _avg: { duration: true }
      })
    ])

    const conversionRate = totalLeads > 0 
      ? parseFloat(((demoBooked / totalLeads) * 100).toFixed(1))
      : 0

    const stats = {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      demoBooked,
      closedWon,
      totalCalls,
      avgCallDuration: Math.round(avgDuration._avg.duration || 0),
      conversionRate,
      revenue: closedWon * 1500 // Estimated revenue per closed deal
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
