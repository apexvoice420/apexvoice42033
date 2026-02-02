import { NextResponse } from 'next/server';
// import { getDb } from '@/lib/firebaseAdmin'; // Removed during migration
import { Lead, ScrapeRequest } from '@/types';

// Mock data generator for demonstration since real GMB scraping requires dedicated proxies/APIs
const mockScrape = (city: string, niche: string): Partial<Lead>[] => {
    return [
        {
            businessName: `${niche} Pro of ${city}`,
            phoneNumber: "+15550101001",
            website: `https://example.com/${city}-pro`,
        },
        {
            businessName: `Best ${niche} in ${city}`,
            phoneNumber: "+15550101002",
            website: `https://best-${niche}-${city}.com`,
        },
        {
            businessName: `${city} ${niche} Services`,
            phoneNumber: "+15550101003",
            website: `https://services-${city}.com`,
        },
    ];
};

export async function POST(request: Request) {
    try {
        const body: ScrapeRequest = await request.json();
        const { city, niche } = body;

        if (!city || !niche) {
            return NextResponse.json(
                { error: 'City and niche are required' },
                { status: 400 }
            );
        }

        // In a real implementation, call an external scraper service here (e.g., SERPAPI, BrightData)
        // or run a Puppeteer script if environment allows (Vercel limits this).
        // For this demonstration, we generating mock leads.
        const scrappedData = mockScrape(city, niche);

        const results = [];

        for (const data of scrappedData) {
            // Validation check (ensure phone number exists)
            if (!data.phoneNumber) continue;

            const lead: Lead = {
                id: '', // Will be set by Firestore
                businessName: data.businessName || 'Unknown',
                phoneNumber: data.phoneNumber,
                website: data.website || '',
                status: 'New',
                city,
                niche,
                createdAt: new Date(),
                lastContacted: null,
                notes: 'Imported via Lead Engine Agent'
            };

            // Add to Firestore
            const db = getDb();
            const docRef = await db.collection('leads').add(lead);

            // Update with generated ID
            await docRef.update({ id: docRef.id });

            results.push({ ...lead, id: docRef.id });
        }

        return NextResponse.json({
            success: true,
            data: results,
            message: `Successfully imported ${results.length} leads for ${niche} in ${city}.`
        });

    } catch (error: any) {
        console.error('Error in Lead Engine Agent:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
