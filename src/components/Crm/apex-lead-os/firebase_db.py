import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime

# Initialize Firebase
try:
    cred_path = os.path.join(os.path.dirname(__file__), "service_account.json")
    
    if os.environ.get("FIREBASE_CREDENTIALS"):
        # For Vercel Environment Variable
        import json
        cred_dict = json.loads(os.environ.get("FIREBASE_CREDENTIALS"))
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        print("[Firebase] Initialized with FIREBASE_CREDENTIALS env var")
    elif os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print("[Firebase] Initialized with service_account.json")
    else:
        # Attempt minimal init (works on Google Cloud environment) or mock
        print("[Firebase] service_account.json not found. Attempting default credentials...")
        firebase_admin.initialize_app()
except Exception as e:
    print(f"[Firebase] Initialization failed: {e}")

try:
    db = firestore.client()
except:
    db = None
    print("[Firebase] Firestore client could not be created.")

# --- Helper Classes (Mimic SQLAlchemy Models for Frontend Compatibility) ---
class LeadStub:
    def __init__(self, id, data):
        self.id = id
        self.name = data.get("name")
        self.phone = data.get("phone")
        self.email = data.get("email")
        self.status = data.get("status", "NEW")
        self.notes = data.get("notes")
        # Handle timestamp conversion
        ts = data.get("created_at")
        if ts:
             # Firestore timestamp to datetime
             self.created_at = ts
        else:
             self.created_at = datetime.utcnow()
    
    # Allow .value access for Enum-like status if needed, but we use strings now
    # We might need a status object wrapper if the template does lead.status.value
    pass

class WorkflowStub:
    def __init__(self, id, data):
        self.id = id
        self.name = data.get("name")
        self.trigger_type = data.get("trigger_type")
        self.config = data.get("config")
        self.status = data.get("status")
        self.last_run = data.get("last_run")

# --- CRUD Operations ---

def get_all_leads():
    if not db: return []
    try:
        docs = db.collection("leads").order_by("created_at", direction=firestore.Query.DESCENDING).stream()
        leads = []
        for doc in docs:
            leads.append(LeadStub(doc.id, doc.to_dict()))
        return leads
    except Exception as e:
        print(f"[Firestore Error] get_all_leads: {e}")
        return []

def get_lead(lead_id):
    if not db: return None
    try:
        doc = db.collection("leads").document(str(lead_id)).get()
        if doc.exists:
            return LeadStub(doc.id, doc.to_dict())
        return None
    except Exception as e:
        print(f"[Firestore Error] get_lead: {e}")
        return None

def add_lead(data):
    """
    Data should be a dict: {name, phone, email, status, notes}
    """
    if not db: return None
    try:
        data["created_at"] = datetime.utcnow()
        # Ensure status is string
        if hasattr(data.get("status"), "value"):
            data["status"] = data["status"].value
            
        _, ref = db.collection("leads").add(data)
        return ref.id
    except Exception as e:
        print(f"[Firestore Error] add_lead: {e}")
        return None

def update_lead(lead_id, data):
    if not db: return
    try:
        # Convert Enum if present
        if "status" in data and hasattr(data["status"], "value"):
            data["status"] = data["status"].value
            
        db.collection("leads").document(str(lead_id)).update(data)
    except Exception as e:
        print(f"[Firestore Error] update_lead: {e}")

def delete_lead(lead_id):
    if not db: return
    try:
        db.collection("leads").document(str(lead_id)).delete()
    except Exception as e:
        print(f"[Firestore Error] delete_lead: {e}")

def get_lead_by_phone(phone):
    if not db: return None
    try:
        docs = db.collection("leads").where("phone", "==", phone).limit(1).stream()
        for doc in docs:
            return LeadStub(doc.id, doc.to_dict())
        return None
    except Exception as e:
        print(f"[Firestore Error] get_lead_by_phone: {e}")
        return None

# --- Workflows ---

def get_workflows():
    if not db: return []
    try:
        docs = db.collection("workflows").stream()
        return [WorkflowStub(doc.id, doc.to_dict()) for doc in docs]
    except:
        return []

def add_workflow(data):
    if not db: return
    data["created_at"] = datetime.utcnow()
    db.collection("workflows").add(data)

def delete_workflow(workflow_id):
    if not db: return
    db.collection("workflows").document(str(workflow_id)).delete()
