import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        const { leadId } = await req.json();

        // Get lead from Firestore
        const leadDoc = await getDoc(doc(db, 'leads', leadId));

        if (!leadDoc.exists()) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        const lead = leadDoc.data();

        // Call VAPI
        const vapiResponse = await fetch('https://api.vapi.ai/call/phone', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: lead.phone,
                assistantId: process.env.VAPI_ASSISTANT_ID,
                customer: {
                    name: lead.businessName
                },
                metadata: {
                    leadId: leadId
                }
            })
        });

        if (!vapiResponse.ok) {
            throw new Error('VAPI call failed');
        }

        const vapiData = await vapiResponse.json();

        // Log call
        await addDoc(collection(db, 'calls'), {
            leadId: leadId,
            vapiCallId: vapiData.id,
            status: 'initiated',
            phoneNumber: lead.phone,
            businessName: lead.businessName,
            createdAt: serverTimestamp()
        });

        // Update lead status
        await updateDoc(doc(db, 'leads', leadId), {
            status: 'Called',
            lastCalledAt: serverTimestamp()
        });

        return NextResponse.json({
            success: true,
            callId: vapiData.id
        });

    } catch (error) {
        console.error('Call error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
