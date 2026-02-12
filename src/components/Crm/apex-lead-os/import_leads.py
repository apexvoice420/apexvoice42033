import pandas as pd
import firebase_db
import os
import sys

# Ensure we can find the csv file relative to this script or project root
CSV_PATH = "../florida_leads.csv" 

def import_leads():
    print("Initializing Firebase connection...")
    # firebase_db initializes on import
    
    csv_full_path = os.path.join(os.path.dirname(__file__), CSV_PATH)
    if not os.path.exists(csv_full_path):
        print(f"Error: CSV file not found at {csv_full_path}")
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

    df = df.fillna("")
    
    imported_count = 0
    skipped_count = 0
    
    print(f"Found {len(df)} rows. Starting import to Firestore...")
    
    for index, row in df.iterrows():
        name = row.get("Business Name")
        phone = row.get("Phone")
        
        if not name:
            skipped_count += 1
            continue
            
        phone_str = str(phone).strip() if phone else ""
        
        # Check for duplicates
        existing_lead = firebase_db.get_lead_by_phone(phone_str)
        if existing_lead:
            print(f"Skipping duplicate: {name} ({phone_str})")
            skipped_count += 1
            continue
            
        # Construct notes
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
        
        firebase_db.add_lead({
            "name": name,
            "phone": phone_str,
            "email": "",
            "status": "NEW",
            "notes": notes_str
        })
        imported_count += 1
        
    print("-" * 30)
    print(f"Import Complete!")
    print(f"Successfully Imported: {imported_count}")
    print(f"Skipped (Duplicates/Invalid): {skipped_count}")
    print("-" * 30)

if __name__ == "__main__":
    import_leads()
