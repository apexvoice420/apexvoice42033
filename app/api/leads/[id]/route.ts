import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id: parseInt(params.id) },
            include: {
                notes: { orderBy: { createdAt: 'desc' } },
                calls: { orderBy: { createdAt: 'desc' } }
            }
        });

        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        return NextResponse.json(lead);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
