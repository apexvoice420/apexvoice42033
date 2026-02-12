import pandas as pd
import requests
import time
import os

# Configuration
CSV_PATH = "../florida_leads.csv"
REMOTE_URL = "https://admin.apexvoicesolutions.org/api/webhooks/inbound"

def remote_import():
    # Locate CSV
    csv_full_path = os.path.join(os.path.dirname(__file__), CSV_PATH)
    if not os.path.exists(csv_full_path):
        # Try local if running from root
        csv_full_path = "florida_leads.csv"
        if not os.path.exists(csv_full_path):
             print(f"Error: CSV file not found at {csv_full_path}.")
             return

    print(f"Reading CSV from {csv_full_path}...")
    try:
        df = pd.read_csv(csv_full_path)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    df = df.fillna("")
    total = len(df)
    success = 0
    failed = 0
    
    print(f"Found {total} rows. Starting remote import to {REMOTE_URL}...")
    print("Press Ctrl+C to stop.")
    
    for index, row in df.iterrows():
        name = row.get("Business Name")
        phone = row.get("Phone")
        
        if not name:
            continue
            
        payload = {
            "name": name,
            "phone": str(phone),
            "email": "" # API requires this field key likely, even if empty
        }
        
        try:
            response = requests.post(REMOTE_URL, json=payload, timeout=5)
            if response.status_code == 200:
                success += 1
                print(f"[{success}/{total}] Imported: {name}")
            else:
                failed += 1
                print(f"[Failed] {name}: Status {response.status_code} - {response.text}")
        except Exception as e:
            failed += 1
            print(f"[Error] {name}: {e}")
            
        # Be nice to the server
        time.sleep(0.1)

    print("-" * 30)
    print(f"Remote Import Complete!")
    print(f"Success: {success}")
    print(f"Failed: {failed}")
    print("-" * 30)

if __name__ == "__main__":
    remote_import()
