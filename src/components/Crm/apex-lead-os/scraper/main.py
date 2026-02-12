import asyncio
import random
from playwright.async_api import async_playwright
import pandas as pd
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
import os

# Configuration
NICHES = [
    "Plumbers",
    "HVAC",
    "Dentist",
    "Law offices",
    "Roofers",
    "Electricians"
]
LOCATION = "Florida"
MIN_RATING = 4.0
OUTPUT_FILE = "florida_leads.csv"

console = Console()

async def scrape_gmb():
    final_results = []
    
    async with async_playwright() as p:
        console.print(f"[bold cyan]Starting GMB Scraper for {LOCATION}...[/bold cyan]")
        
        # Launch browser (headless=True for speed, False for debugging)
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            console=console
        ) as progress:
            
            overall_task = progress.add_task("[green]Overall Progress", total=len(NICHES))
            
            for niche in NICHES:
                search_term = f"{niche} in {LOCATION}"
                progress.update(overall_task, description=f"[green]Scraping {niche}...")
                
                page = await context.new_page()
                
                try:
                    # Go to Google Maps
                    await page.goto(f"https://www.google.com/maps/search/{search_term}")
                    try:
                        await page.wait_for_selector('div[role="feed"]', timeout=10000)
                    except:
                         # Fallback for different DOM structures or empty results
                         console.print(f"[yellow]Could not find results feed for {niche}. Skipping...[/yellow]")
                         await page.close()
                         progress.advance(overall_task)
                         continue
                    
                    # Scroll the feed to load more results
                    feed_selector = 'div[role="feed"]'
                    
                    # Initial scroll to load some results. 
                    # Google Maps infinite scroll can be tricky. We'll do a few scrolls.
                    # For a robust scraper, we might scroll until end, but let's limit to get a reasonable sample.
                    for _ in range(5): 
                        await page.evaluate(f"document.querySelector('{feed_selector}').scrollBy(0, 2000)")
                        await page.wait_for_timeout(random.randint(1000, 2000))
                    
                    # Find all result items
                    # The class names in Google Maps are dynamic and obfuscated. 
                    # We often rely on structure like role="article" or specific aria-labels.
                    # A common selector for the listing items:
                    listings = await page.locator('div[role="article"]').all()
                    
                    niche_results = []
                    
                    for listing in listings:
                        data = {
                            "Business Name": None,
                            "Address": None,
                            "Phone": None,
                            "Website": None,
                            "Rating": 0.0,
                            "Niche": niche
                        }
                        
                        try:
                            # Extract Text Info using Aria Labels or visible text
                            text_content = await listing.inner_text()
                            lines = text_content.split('\n')
                            
                            if lines:
                                data["Business Name"] = lines[0] # Usually the first line
                            
                            # Attempt to get rating
                            # The rating is often in an aria-label like "4.8 stars 150 reviews"
                            aria_label = await listing.get_attribute("aria-label")
                            if aria_label:
                                if "stars" in aria_label:
                                    try:
                                        parts = aria_label.split("stars")
                                        rating_part = parts[0].strip().split()[-1]
                                        data["Rating"] = float(rating_part)
                                    except:
                                        pass
                            
                            # If we couldn't get rating from aria-label, try to parse from text
                            # (Sometimes it appears as "4.8(150)")
                            if data["Rating"] == 0.0:
                                for line in lines:
                                    try:
                                        # very naive check for float at start of line
                                        if line[0].isdigit() and '.' in line[:4]:
                                            possible_rating = float(line.split('(')[0].strip())
                                            if 1.0 <= possible_rating <= 5.0:
                                                data["Rating"] = possible_rating
                                                break
                                    except:
                                        continue

                            # Filter by Rating immediately
                            if data["Rating"] < MIN_RATING:
                                continue
                                
                            # To get more details like Website/Phone, we often need to click 
                            # or look for specific icons. However, clicking every item takes time.
                            # For a "simple" scraper, we can try to extract from the list view if valid.
                            # If not, we might skip implementation complexity of clicking each one for now
                            # to keep it fast and "simple/clean" as requested, unless details are missing.
                            
                            # Let's try to infer address/phone from lines if possible
                            # This is heuristic based since structure varies
                            for line in lines:
                                if "Florida" in line: # Address usually contains the state
                                    data["Address"] = line
                                if any(char.isdigit() for char in line) and "-" in line and len(line) >= 10:
                                     # very loose phone check
                                     if not data["Address"] or line != data["Address"]:
                                         data["Phone"] = line

                            # Check for website button which usually has a specific destination
                            if await listing.locator('a[data-value="Website"]').count() > 0:
                                data["Website"] = await listing.locator('a[data-value="Website"]').get_attribute('href')
                            
                            # If name is missing, skip
                            if not data["Business Name"]:
                                continue
                                
                            final_results.append(data)
                            niche_results.append(data)
                            
                        except Exception as e:
                            # Fail silently for individual listing errors to keep going
                            continue
                            
                    console.print(f"  [cyan]Found {len(niche_results)} valid leads for {niche}[/cyan]")
                    
                except Exception as e:
                    console.print(f"[red]Error scraping {niche}: {str(e)}[/red]")
                finally:
                    await page.close()
                    progress.advance(overall_task)
            
        await browser.close()
        
    # Save to CSV
    if final_results:
        df = pd.DataFrame(final_results)
        # Drop duplicates based on Name and Address to be clean
        df = df.drop_duplicates(subset=["Business Name", "Address"])
        df.to_csv(OUTPUT_FILE, index=False)
        console.print(f"[bold green]Success! Scraped {len(df)} businesses. Saved to {OUTPUT_FILE}[/bold green]")
    else:
        console.print("[bold yellow]No businesses found matching criteria.[/bold yellow]")

if __name__ == "__main__":
    asyncio.run(scrape_gmb())
