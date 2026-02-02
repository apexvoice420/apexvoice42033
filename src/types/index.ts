export interface Lead {
    id?: string;
    businessName: string;
    phone: string;
    address?: string;
    website?: string;
    status: 'New Lead' | 'Called' | 'Demo Booked' | 'Not Interested';
    city: string;
    state?: string;
    niche?: string;
    rating?: number;
    lastContacted?: any; // Firestore Timestamp
    notes?: string;
    createdAt?: any;
    source?: string;
}

export interface ScrapeRequest {
    city: string;
    state: string;
    type: string;
    minRating: number;
    maxResults: number;
}
