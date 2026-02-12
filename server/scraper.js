const { chromium } = require('playwright');

async function scrapeGoogleMaps(city, state, type, maxResults = 10) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    const leads = [];

    try {
        const query = `${type} in ${city}, ${state}`;
        console.log(`Searching for: ${query}`);

        await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, {
            waitUntil: 'networkidle'
        });

        // Auto-scroll to load more results
        await page.evaluate(async () => {
            const wrapper = document.querySelector('div[role="feed"]');
            if (wrapper) {
                for (let i = 0; i < 5; i++) {
                    wrapper.scrollTop = wrapper.scrollHeight;
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        });

        // Extract Data
        const items = await page.$$('div[role="article"]');

        for (const item of items) {
            if (leads.length >= maxResults) break;

            const text = await item.innerText();
            const lines = text.split('\n');
            const phoneRegex = /(\(\d{3}\)\s\d{3}-\d{4})|(\d{3}-\d{3}-\d{4})/;

            // Simple heuristics for demo purposes
            const businessName = lines[0];
            const phoneMatch = text.match(phoneRegex);
            const ratingMatch = text.match(/(\d\.\d)\s\(\d+\)/); // e.g. 4.8 (120)

            if (phoneMatch) {
                leads.push({
                    businessName: businessName,
                    phone: phoneMatch[0],
                    city: city,
                    state: state,
                    rating: ratingMatch ? parseFloat(ratingMatch[1]) : 0,
                    source: 'Google Maps'
                });
            }
        }

    } catch (error) {
        console.error('Scraping Error:', error);
    } finally {
        await browser.close();
    }

    return leads;
}

module.exports = { scrapeGoogleMaps };
