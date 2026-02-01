import asyncio
import random
from playwright.async_api import async_playwright
import json

# Configuration
MIN_RATING = 4.0

async def scrape_gmb_generator(niche: str, location: str):
    """
    Async generator that yields SSE-compatible event strings.
    """
    search_term = f"{niche} in {location}"
    yield f"data: {json.dumps({'status': 'info', 'message': f'Starting scrape for {search_term }...'})}\n\n"
    
    try:
        async with async_playwright() as p:
            # Launch browser
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
            
            page = await context.new_page()
            
            yield f"data: {json.dumps({'status': 'info', 'message': 'Navigating to Google Maps...'})}\n\n"

            try:
                # Go to Google Maps
                await page.goto(f"https://www.google.com/maps/search/{search_term}")
                try:
                    await page.wait_for_selector('div[role="feed"]', timeout=10000)
                except:
                     yield f"data: {json.dumps({'status': 'error', 'message': 'Could not find results feed'})}\n\n"
                     await browser.close()
                     return
                
                # Scroll
                feed_selector = 'div[role="feed"]'
                yield f"data: {json.dumps({'status': 'info', 'message': 'Scrolling for results...'})}\n\n"

                for i in range(3): 
                    await page.evaluate(f"document.querySelector('{feed_selector}').scrollBy(0, 2000)")
                    await page.wait_for_timeout(random.randint(1000, 2000))
                
                # Extract
                listings = await page.locator('div[role="article"]').all()
                yield f"data: {json.dumps({'status': 'info', 'message': f'Found {len(listings)} potential listings. Extracting details...'})}\n\n"

                for listing in listings:
                    data = {
                        "name": None,
                        "address": None,
                        "phone": None,
                        "website": None,
                        "rating": 0.0,
                        "status": "new"
                    }
                    
                    try:
                        text_content = await listing.inner_text()
                        lines = text_content.split('\n')
                        
                        if lines:
                            data["name"] = lines[0] 
                        
                        # Rating
                        aria_label = await listing.get_attribute("aria-label") or ""
                        if "stars" in aria_label:
                            try:
                                parts = aria_label.split("stars")
                                rating_part = parts[0].strip().split()[-1]
                                data["rating"] = float(rating_part)
                            except:
                                pass
                        
                        if data["rating"] < MIN_RATING:
                             continue

                        # Phone / Address Heuristics
                        for line in lines:
                            if location in line: 
                                data["address"] = line
                            if any(char.isdigit() for char in line) and "-" in line and len(line) >= 10:
                                 if not data["address"] or line != data["address"]:
                                     data["phone"] = line

                        # Website
                        if await listing.locator('a[data-value="Website"]').count() > 0:
                            data["website"] = await listing.locator('a[data-value="Website"]').get_attribute('href')
                        
                        if data["name"]:
                             yield f"data: {json.dumps({'status': 'lead', 'lead': data})}\n\n"
                        
                    except Exception:
                        continue
                        
                yield f"data: {json.dumps({'status': 'complete', 'message': 'Scraping finished'})}\n\n"

            except Exception as e:
                yield f"data: {json.dumps({'status': 'error', 'message': str(e)})}\n\n"
            finally:
                await page.close()
            
            await browser.close()
            
    except Exception as e:
        yield f"data: {json.dumps({'status': 'error', 'message': str(e)})}\n\n"
