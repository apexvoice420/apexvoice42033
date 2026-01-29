import firebase_db
import time

def call_vapi(phone: str):
    # Mock Vapi Call
    print(f"[VAPI] Calling {phone}...")
    return False # Simulating failure to trigger next step (SMS)

def send_sms(phone: str, message: str):
    # Mock Twilio SMS
    print(f"[Twilio] Sending SMS to {phone}: {message}")
    return True

def process_leads():
    """
    Background worker process.
    """
    try:
        leads = firebase_db.get_all_leads() # Inefficient for large DB but okay for demo
        
        for lead in leads:
            # 1. NEW -> CONTACTING
            if lead.status == "NEW":
                print(f"Processing NEW lead: {lead.name}")
                call_vapi(lead.phone)
                firebase_db.update_lead(lead.id, {"status": "CONTACTING"})
                print(f"Lead {lead.name} moved to CONTACTING")
            
            # 2. CONTACTING -> NURTURING
            elif lead.status == "CONTACTING":
                # print(f"Processing CONTACTING lead: {lead.name}")
                # Simulate logic: call failed
                call_failed = True 
                if call_failed:
                    send_sms(lead.phone, "Hey! Sorry we missed you. When is a good time to chat?")
                    firebase_db.update_lead(lead.id, {"status": "NURTURING"})
                    print(f"Lead {lead.name} moved to NURTURING")
            
            # 3. NURTURING -> BOOKED
            elif lead.status == "NURTURING":
                if lead.notes and "REPLIED" in lead.notes:
                    print(f"[Admin Alert] Lead {lead.name} has replied!")
                    firebase_db.update_lead(lead.id, {"status": "BOOKED"})
                    print(f"Lead {lead.name} moved to BOOKED")
                    
    except Exception as e:
        print(f"Error in process_leads: {e}")
