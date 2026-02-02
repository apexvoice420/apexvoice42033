import { NextResponse } from 'next/server';
// import { getDb } from '@/lib/firebaseAdmin'; // Removed during migration
import { Lead } from '@/types';

// Twilio sends form-encoded data, but Next.js App Router Request structure handles formData.
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const callStatus = formData.get('CallStatus') as string;
        const url = new URL(request.url);
        const leadId = url.searchParams.get('leadId');

        if (!leadId) {
            return NextResponse.json({ error: 'Missing leadId' }, { status: 400 });
        }

        console.log(`Webhook received for Lead ${leadId}. Status: ${callStatus}`);

        const db = getDb();
        const leadRef = db.collection('leads').doc(leadId);

        // Map Twilio Status to our logic
        // 'booked' status would ideally come from the AI conversation logic (via a separate function call or post-processing),
        // but here we handle standard telephony outcomes.
        // If the AI determined a booking, it should ideally have updated the state or sent a specific signal.
        // For now, we handle: 'no_answer' -> Retry, 'completed' -> (Assume conversation happened, waiting for AI result?), 'busy' -> Retry.

        // NOTE: The user prompt says "IF outcome is 'booked'... IF outcome is 'no_answer'".
        // 'booked' usually comes from the AI analysis.
        // 'no-answer' comes from Twilio.

        let newStatus: Lead['status'] | null = null;

        if (['no-answer', 'busy', 'failed'].includes(callStatus)) {
            newStatus = 'Retry';
        } else if (callStatus === 'completed') {
            // Completed just means the call connected and finished.
            // We don't change status to 'Booked' here automatically unless we have distinct info.
            // However, if we assume 'completed' means 'Called', we might leave it or check AI logs.
            // For this implementation, we will NOT overwrite 'Booked' if it was set by the AI agent during the call.
            // We'll read the current status first.
            const doc = await leadRef.get();
            const currentData = doc.data() as Lead;

            if (currentData.status !== 'Booked') {
                // If not booked, maybe mark as 'Called' or 'Lost' if not interested?
                // Without AI outcome signal, we stick to 'Called'.
                newStatus = 'Called';
            }
        }

        if (newStatus) {
            await leadRef.update({
                status: newStatus
            });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
