export interface Lead {
    id: any; // Allow string or number for compatibility
    businessName: string;
    phone: string;
    address?: string;
    website?: string;
    status: string; // Relaxed to avoid union mismatch during migration
    city?: string;
    state?: string;
    niche?: string;
    rating?: number;
    lastCalledAt?: Date;
    notes?: string;
    createdAt?: Date;
    source?: string;
    [key: string]: any;
}

export interface ScrapeRequest {
    city: string;
    state: string;
    type: string;
    minRating: number;
    maxResults: number;
}
