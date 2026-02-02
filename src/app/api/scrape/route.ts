import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright-core';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes timeout

export async function POST(req: NextRequest) {
    try {
        const { city, state, type, minRating, maxResults } = await req.json();

        // Launch browser (Render.com supports this with buildpacks)
        const browser = await chromium.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Go to Google Maps
        await page.goto(`https://www.google.com/maps/search/${type}+in+${city}+${state}`);
        await page.waitForSelector('[role="article"]', { timeout: 10000 });

        const results = [];
        const listings = await page.$$('[role="article"]');

        for (let i = 0; i < Math.min(listings.length, maxResults); i++) {
            const listing = listings[i];

            try {
                const name = await listing.$eval('.fontHeadlineSmall', el => el.textContent);
                const ratingText = await listing.$eval('.fontBodyMedium span[role="img"]',
                    el => el.getAttribute('aria-label')).catch(() => '0 stars');
                const rating = parseFloat(ratingText.split(' ')[0]);

                if (rating >= minRating) {
                    // Click to get phone number
                    await listing.click();
                    await page.waitForTimeout(1500);

                    const phone = await page.$eval('[data-item-id*="phone"]',
                        el => el.textContent.trim()).catch(() => null);

                    const address = await page.$eval('[data-item-id*="address"]',
                        el => el.textContent.trim()).catch(() => null);

                    if (phone) {
                        const leadData = {
                            businessName: name,
                            phone: phone,
                            address: address || `${city}, ${state}`,
                            city: city,
                            state: state,
                            niche: type,
                            rating: rating,
                            status: 'New Lead',
                            source: 'Google Maps',
                            createdAt: serverTimestamp()
                        };

                        // Save to Firestore
                        const docRef = await addDoc(collection(db, 'leads'), leadData);
                        results.push({ id: docRef.id, ...leadData });
                    }
                }
            } catch (error) {
                console.error('Error scraping listing:', error);
                continue;
            }
        }

        await browser.close();

        return NextResponse.json({
            success: true,
            found: results.length,
            leads: results
        });

    } catch (error) {
        console.error('Scrape error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
