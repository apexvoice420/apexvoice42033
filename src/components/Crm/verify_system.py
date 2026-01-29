from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
import sys

# Add path to find models
sys.path.append(os.path.join(os.getcwd(), "apex-lead-os"))
from models import Lead, LeadStatus, SessionLocal

def check_system():
    # 1. Check DB File
    if not os.path.exists("apex-lead-os/leads.db"):
        print("[FAIL] leads.db not found!")
        return
    
    # 2. Check Data
    try:
        db = SessionLocal()
        count = db.query(Lead).count()
        print(f"[OK] Database Connection Successful.")
        print(f"[INFO] Total Leads in DB: {count}")
        
        if count == 0:
            print("[WARN] Database is empty. Import did not persist?")
        else:
            first = db.query(Lead).first()
            print(f"[INFO] Sample Lead: {first.name} - {first.status}")
            
        db.close()
    except Exception as e:
        print(f"[FAIL] Database Error: {e}")

if __name__ == "__main__":
    check_system()
