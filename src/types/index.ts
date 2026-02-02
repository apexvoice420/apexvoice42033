export interface Lead {
    id?: string;
    businessName: string;
    phoneNumber: string;
    website?: string;
    status: 'New' | 'Called' | 'Booked' | 'Retry' | 'Lost';
    city: string;
    niche: string;
    lastContacted?: Date | null;
    notes?: string;
    createdAt?: Date;
}

export interface ScrapeRequest {
    city: string;
    niche: string;
}
