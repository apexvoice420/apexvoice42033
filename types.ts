export interface Lead {
    id: number;
    business_name: string;
    phone: string;
    email?: string;
    website?: string;
    city: string;
    state: string;
    rating?: number;
    review_count?: number;
    status: 'New' | 'Called' | 'Booked' | 'Retry' | 'Lost' | 'New Lead';
    niche: string;
    source?: string;
    notes?: string;
    created_at?: string;
    last_called_at?: string;
}
