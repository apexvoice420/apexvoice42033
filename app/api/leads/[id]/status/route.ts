import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { status } = await req.json();

        const updatedLead = await prisma.lead.update({
            where: { id: parseInt(params.id) },
            data: { status }
        });

        return NextResponse.json(updatedLead);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
