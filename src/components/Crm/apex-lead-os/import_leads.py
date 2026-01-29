import pandas as pd
from sqlalchemy.orm import Session
from models import SessionLocal, Lead, LeadStatus, init_db
import os
import sys

# Ensure we can find the csv file relative to this script or project root
# Assuming this script is in apex-lead-os/ and csv is in src/components/Crm/ (one level up)
# OR csv might be in apex-lead-os/.. 
# Let's try to find the file dynamically or hardcode the path based on known structure.
CSV_PATH = "../florida_leads.csv" 

def import_leads():
    print("Initializing Database connection...")
    init_db()
    db = SessionLocal()
    
    csv_full_path = os.path.join(os.path.dirname(__file__), CSV_PATH)
    if not os.path.exists(csv_full_path):
        print(f"Error: CSV file not found at {csv_full_path}")
        # Try looking in current dir just in case
        csv_full_path = "florida_leads.csv"
        if not os.path.exists(csv_full_path):
             print(f"Error: CSV file not found at {csv_full_path} either.")
             return

    print(f"Reading CSV from {csv_full_path}...")
    try:
        df = pd.read_csv(csv_full_path)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    # Basic cleanup
    df = df.fillna("")
    
    imported_count = 0
    skipped_count = 0
    
    print(f"Found {len(df)} rows. Starting import...")
    
    for index, row in df.iterrows():
        name = row.get("Business Name")
        phone = row.get("Phone")
        
        # Skip if no name
        if not name:
            skipped_count += 1
            continue
            
        # Clean phone
        phone_str = str(phone).strip() if phone else ""
        
        # Check for duplicates (by phone if exists, else by name)
        existing_lead = None
        if phone_str:
            existing_lead = db.query(Lead).filter(Lead.phone == phone_str).first()
        
        if not existing_lead:
            existing_lead = db.query(Lead).filter(Lead.name == name).first()
            
        if existing_lead:
            print(f"Skipping duplicate: {name} ({phone_str})")
            skipped_count += 1
            continue
            
        # Construct notes with extra info
        notes_parts = []
        if row.get("Niche"):
            notes_parts.append(f"Niche: {row.get('Niche')}")
        if row.get("Rating"):
            notes_parts.append(f"Rating: {row.get('Rating')} stars")
        if row.get("Address"):
            notes_parts.append(f"Address: {row.get('Address')}")
        if row.get("Website"):
            notes_parts.append(f"Website: {row.get('Website')}")
            
        notes_str = " | ".join(notes_parts)
        
        new_lead = Lead(
            name=name,
            phone=phone_str,
            email="", # CSV doesn't have email
            status=LeadStatus.NEW,
            notes=notes_str
        )
        
        db.add(new_lead)
        imported_count += 1
        
    db.commit()
    db.close()
    
    print("-" * 30)
    print(f"Import Complete!")
    print(f"Successfully Imported: {imported_count}")
    print(f"Skipped (Duplicates/Invalid): {skipped_count}")
    print("-" * 30)

if __name__ == "__main__":
    import_leads()
