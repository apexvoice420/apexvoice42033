export enum LeadStatus {
    NEW = 'New Lead',
    CALLED = 'Called',
    DEMO_BOOKED = 'Demo Booked',
    NOT_INTERESTED = 'Not Interested',
    CONTACTING = 'Contacting', // Added for compatibility if needed
    DEAD = 'Dead',             // Added for compatibility if needed
}

export type ViewType = 'opportunities' | 'scraper' | 'settings';

export interface Stats {
    totalCalls: number;
    conversionRate: number;
    revenue: number;
}

export interface Lead {
    id: string;
    businessName: string;
    phone: string;
    address?: string;
    website?: string;
    status: LeadStatus;
    city?: string;
    state?: string;
    niche?: string;
    rating?: number;
    stars?: number; // Added from App.tsx
    lastContacted?: any;
    notes?: string;
    createdAt?: any;
    source?: string;
    revenue?: number; // Added from App.tsx
}

export interface ScrapeRequest {
    city: string;
    state: string;
    type: string;
    minRating: number;
    maxResults: number;
}
