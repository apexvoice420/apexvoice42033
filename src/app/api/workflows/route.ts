import { NextResponse } from 'next/server';

// In-memory workflows store (for demo purposes)
const workflows: any[] = [];

export async function GET() {
    return NextResponse.json({ workflows });
}

export async function POST(request: Request) {
    const body = await request.json();
    const workflow = {
        id: `wf_${Date.now()}`,
        ...body,
        last_run: null,
        created_at: new Date().toISOString()
    };
    workflows.push(workflow);
    return NextResponse.json({ success: true, workflow });
}
