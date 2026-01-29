from fastapi import FastAPI, Depends, Request, Form, HTTPException, status, BackgroundTasks, UploadFile, File
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import io
import pandas as pd
import threading
import time
import os

from models import LeadStatus
import auth
import state_engine
import firebase_db  # Abstracted Firebase Logic

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

# Background Runner
def start_state_engine():
    # Run every 10 seconds
    while True:
        state_engine.process_leads()
        time.sleep(10)

@app.on_event("startup")
def on_startup():
    # Ensure background thread starts if supported (Vercel might kill it, but okay for dev)
    if not os.environ.get("VERCEL"):
        t = threading.Thread(target=start_state_engine, daemon=True)
        t.start()

# --- Auth Helpers ---
def get_current_admin(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        return None
    
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
async def inbound_webhook(request: Request):
    try:
        data = await request.json()
        lead_data = {
            "name": data.get("name"),
            "phone": data.get("phone"),
            "email": data.get("email"),
            "status": "NEW",
            "notes": "Inbound Webhook"
        }
        firebase_db.add_lead(lead_data)
    except Exception as e:
        print(f"Webhook Error: {e}")
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=400)
    
    return {"status": "success"}

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
def dashboard(request: Request):
    user = get_current_admin(request)
    if not user:
        return RedirectResponse(url="/auth/login")
    
    leads = firebase_db.get_all_leads()
    
    # Calculate Stats
    total_leads = len(leads)
    calls_made = sum(1 for l in leads if l.status != "NEW")
    booked_leads = sum(1 for l in leads if l.status == "BOOKED")
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
def trigger_call(lead_id: str):
    lead = firebase_db.get_lead(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    # Mock Vapi Trigger
    firebase_db.update_lead(lead_id, {
        "status": "CONTACTING", 
        "notes": (lead.notes or "") + " [Manual Call Triggered]"
    })
    
    return {"status": "success", "message": f"Calling {lead.name}..."}

@app.delete("/api/lead/{lead_id}")
def delete_lead(lead_id: str):
    firebase_db.delete_lead(lead_id)
    return HTMLResponse(status_code=200, content="") # Return empty to remove row

@app.post("/api/campaigns/start")
def start_campaign(name: str = Form(...)):
    print(f"[API] Starting Campaign: {name}")
    return {"status": "success", "message": f"Campaign {name} started"}

@app.post("/api/leads/import")
async def import_leads_csv(file: UploadFile = File(...)):
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
            
            # Duplicate Check using DB abstraction
            exists = firebase_db.get_lead_by_phone(phone_str)
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
            
            firebase_db.add_lead({
                "name": name,
                "phone": phone_str,
                "email": row.get("Email", ""),
                "status": "NEW",
                "notes": notes_str
            })
            imported_count += 1
            
        return JSONResponse(content={
            "status": "success",
            "message": f"Imported {imported_count} leads. Skipped {skipped_count} duplicates."
        })
        
    except Exception as e:
        print(f"Import Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
