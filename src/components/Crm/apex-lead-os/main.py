from fastapi import FastAPI, Depends, Request, Form, HTTPException, status, BackgroundTasks
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models import SessionLocal, Lead, LeadStatus, Workflow, init_db
from google_sheets import GoogleSheetsClient
import auth
import state_engine
import threading
import time
import os
from fastapi import FastAPI, Depends, Request, Form, HTTPException, status, BackgroundTasks, UploadFile, File
import io
import pandas as pd

# ... (rest of imports)


# --- API Routes for Dashboard Interactivity ---

app = FastAPI(title="Apex Lead OS")

# Security & CORS
origins = [
    "https://www.apexvoicesolutions.org",
    "http://localhost:3000",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fix for Vercel/Different CWD: Use absolute path for templates
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Background Runner
def start_state_engine():
    # Run every 10 seconds
    while True:
        state_engine.process_leads()
        time.sleep(10)

@app.on_event("startup")
def on_startup():
    init_db()
    # Start background thread
    t = threading.Thread(target=start_state_engine, daemon=True)
    t.start()

# --- Auth Helpers ---
def get_current_admin(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        return None
    
    # Remove "Bearer " if present (though cookie usually just value)
    if token.startswith("Bearer "):
        token = token.split(" ")[1]
        
    user = auth.verify_token(token)
    return user

def login_required(request: Request):
    user = get_current_admin(request)
    if not user:
        raise HTTPException(status_code=status.HTTP_307_TEMPORARY_REDIRECT, detail="Not authenticated")
    return user

# --- Routes ---

@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return RedirectResponse(url="/dashboard")

@app.post("/api/webhooks/inbound")
async def inbound_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Public webhook to receive leads from Vercel frontend.
    Expected JSON: { "name": "...", "phone": "...", "email": "..." }
    """
    try:
        data = await request.json()
        new_lead = Lead(
            name=data.get("name"),
            phone=data.get("phone"),
            email=data.get("email"),
            status=LeadStatus.NEW,
            notes="Inbound Webhook"
        )
        db.add(new_lead)
        db.commit()
    except Exception as e:
        # Log error but return 200 to not break sender? Or 400.
        print(f"Webhook Error: {e}")
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=400)
    
    return {"status": "success", "lead_id": new_lead.id}

@app.get("/auth/login", response_class=HTMLResponse)
def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/auth/login")
def login(request: Request, username: str = Form(...), password: str = Form(...)):
    if auth.verify_credentials(username, password):
        token = auth.create_access_token({"sub": username})
        response = RedirectResponse(url="/dashboard", status_code=status.HTTP_303_SEE_OTHER)
        response.set_cookie(key="access_token", value=token, httponly=True)
        return response
    else:
        return templates.TemplateResponse("login.html", {"request": request, "error": "Invalid Credentials"})

@app.get("/auth/logout")
def logout():
    response = RedirectResponse(url="/auth/login")
    response.delete_cookie("access_token")
    return response

@app.get("/dashboard", response_class=HTMLResponse)
def dashboard(request: Request, db: Session = Depends(get_db)):
    user = get_current_admin(request)
    if not user:
        return RedirectResponse(url="/auth/login")
    
    leads = db.query(Lead).order_by(Lead.created_at.desc()).all()
    
    # Calculate Stats
    total_leads = len(leads)
    calls_made = db.query(Lead).filter(Lead.status != LeadStatus.NEW).count()
    booked_leads = db.query(Lead).filter(Lead.status == LeadStatus.BOOKED).count()
    revenue = booked_leads * 500  # Mock $500 per booked lead
    
    conversion_rate = 0
    if total_leads > 0:
        conversion_rate = round((booked_leads / total_leads) * 100, 1)

    stats = {
        "total_leads": total_leads,
        "calls_made": calls_made,
        "conversion_rate": conversion_rate,
        "revenue": revenue
    }
        
    return templates.TemplateResponse("dashboard.html", {
        "request": request, 
        "leads": leads,
        "stats": stats,
        "user": user
    })

# --- API Routes for Dashboard Interactivity ---

@app.post("/api/trigger-call/{lead_id}")
def trigger_call(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Mock Vapi Trigger
    print(f"[API] Manually triggering call for {lead.name} ({lead.phone})")
    lead.status = LeadStatus.CONTACTING
    lead.notes = (lead.notes or "") + " [Manual Call Triggered]"
    db.commit()
    
    return {"status": "success", "message": f"Calling {lead.name}..."}

@app.delete("/api/lead/{lead_id}")
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
        
    db.delete(lead)
    db.commit()
    return HTMLResponse(status_code=200, content="") # Return empty to remove row

@app.post("/api/campaigns/start")
def start_campaign(name: str = Form(...)):
    print(f"[API] Starting Campaign: {name}")
    # Logic to process CSV would go here
    return {"status": "success", "message": f"Campaign {name} started"}

@app.post("/api/leads/import")
async def import_leads_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
        df = df.fillna("")
        
        imported_count = 0
        skipped_count = 0
        
        for index, row in df.iterrows():
            name = row.get("Business Name")
            phone = row.get("Phone")
            
            if not name:
                continue
                
            phone_str = str(phone).strip() if phone else ""
            
            # Duplicate Check
            exists = db.query(Lead).filter((Lead.phone == phone_str) | (Lead.name == name)).first()
            if exists:
                skipped_count += 1
                continue

            # Construct notes
            notes_parts = []
            for col in ["Niche", "Rating", "Address", "Website"]:
                if row.get(col):
                    val = row.get(col)
                    if col == "Rating":
                        val = f"{val} stars"
                    notes_parts.append(f"{col}: {val}")
            
            notes_str = " | ".join(notes_parts)
            
            new_lead = Lead(
                name=name,
                phone=phone_str,
                email=row.get("Email", ""),
                status=LeadStatus.NEW,
                notes=notes_str
            )
            db.add(new_lead)
            imported_count += 1
            
        db.commit()
        
        return JSONResponse(content={
            "status": "success",
            "message": f"Imported {imported_count} leads. Skipped {skipped_count} duplicates."
        })
        
    except Exception as e:
        print(f"Import Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

