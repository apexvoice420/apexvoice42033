import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/leads - Fetch all leads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const city = searchParams.get('city')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    const where: any = {}
    if (status) where.status = status
    if (city) where.city = city

    const leads = await prisma.lead.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        calls: { take: 5, orderBy: { createdAt: 'desc' } },
        notes: { take: 5, orderBy: { createdAt: 'desc' } }
      }
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const lead = await prisma.lead.create({
      data: {
        businessName: body.businessName || body.business_name,
        phone: body.phone || body.phoneNumber,
        email: body.email,
        website: body.website,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode || body.zip_code,
        niche: body.niche,
        rating: body.rating,
        reviewCount: body.reviewCount || body.review_count,
        status: body.status || 'New Lead',
        source: body.source
      }
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error: any) {
    console.error('Error creating lead:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Lead with this phone number already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}

// PUT /api/leads - Update a lead
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        businessName: data.businessName,
        phone: data.phone,
        email: data.email,
        website: data.website,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        niche: data.niche,
        rating: data.rating,
        reviewCount: data.reviewCount,
        status: data.status,
        lastCalledAt: data.lastCalledAt
      }
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

// DELETE /api/leads - Delete a lead
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = parseInt(searchParams.get('id') || '0')

    if (!id) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 })
    }

    await prisma.lead.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}
