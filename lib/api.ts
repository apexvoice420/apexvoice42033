const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchLeads(filters: any = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/leads?${params.toString()}`, {
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to fetch leads');
    return res.json();
}

export async function scrapeLeads(payload: any) {
    const res = await fetch(`${API_URL}/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to start scrape');
    return res.json();
}

export async function updateLeadStatus(id: string | number, status: string) {
    const res = await fetch(`${API_URL}/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
}
