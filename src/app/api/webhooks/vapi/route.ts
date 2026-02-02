import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, call } = body;

        const leadId = call?.metadata?.leadId;

        if (!leadId) {
            return NextResponse.json({ error: 'No leadId in metadata' }, { status: 400 });
        }

        // Analyze transcript
        const transcript = message?.transcript || '';
        let newStatus = 'Called';
        let outcome = 'unknown';

        const lowerTranscript = transcript.toLowerCase();

        if (lowerTranscript.includes('interested') ||
            lowerTranscript.includes('book') ||
            lowerTranscript.includes('schedule') ||
            lowerTranscript.includes('yes')) {
            newStatus = 'Demo Booked';
            outcome = 'interested';
        } else if (call.status === 'ended' && call.endedReason === 'customer-ended-call') {
            newStatus = 'Called';
            outcome = 'completed';
        } else if (call.status === 'ended' && call.endedReason === 'no-answer') {
            newStatus = 'New Lead'; // Retry later
            outcome = 'no-answer';
        } else if (lowerTranscript.includes('not interested')) {
            newStatus = 'Not Interested';
            outcome = 'not_interested';
        }

        // Update lead
        await updateDoc(doc(db, 'leads', leadId), {
            status: newStatus,
            lastCallOutcome: outcome,
            lastUpdated: serverTimestamp()
        });

        // Update call log
        const callsQuery = query(
            collection(db, 'calls'),
            where('vapiCallId', '==', call.id)
        );
        const callSnapshot = await getDocs(callsQuery);

        if (!callSnapshot.empty) {
            await updateDoc(callSnapshot.docs[0].ref, {
                status: 'completed',
                duration: call.duration,
                transcript: transcript,
                outcome: outcome,
                completedAt: serverTimestamp()
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
