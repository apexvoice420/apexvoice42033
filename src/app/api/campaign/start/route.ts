import { NextResponse } from 'next/server';
// import { getDb } from '@/lib/firebaseAdmin'; // Removed during migration
import { twilioClient, twilioPhoneNumber } from '@/lib/twilio';
import { Lead } from '@/types';

export async function POST(request: Request) {
    try {
        // 1. Fetch leads with status 'New'
        const db = getDb();
        const snapshot = await db.collection('leads')
            .where('status', '==', 'New')
            .limit(50) // Limit batch size for safety
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ message: 'No new leads found.' });
        }

        const results = [];
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexvoicesolutions.com';

        for (const doc of snapshot.docs) {
            const lead = doc.data() as Lead;
            const leadId = doc.id;

            if (!lead.phoneNumber) continue;

            try {
                // 2. Initiate Call
                // We point the 'url' to our TwiML handler which will connect to OpenAI Realtime
                const call = await twilioClient.calls.create({
                    url: `${baseUrl}/api/voice/twiml?leadId=${leadId}`,
                    to: lead.phoneNumber,
                    from: twilioPhoneNumber || '+15555555555',
                    statusCallback: `${baseUrl}/api/webhooks/call-result?leadId=${leadId}`,
                    statusCallbackEvent: ['completed', 'busy', 'no-answer', 'failed'],
                });

                // 3. Update Status
                await doc.ref.update({
                    status: 'Called',
                    lastContacted: new Date(),
                });

                results.push({ leadId, callSid: call.sid, status: 'initiated' });
            } catch (callError: any) {
                console.error(`Failed to call lead ${leadId}:`, callError);
                results.push({ leadId, error: callError.message });
            }
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            details: results
        });

    } catch (error: any) {
        console.error('Error starting campaign:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
