from models import SessionLocal, Lead, LeadStatus
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
    db = SessionLocal()
    try:
        # 1. NEW -> CONTACTING
        new_leads = db.query(Lead).filter(Lead.status == LeadStatus.NEW).all()
        for lead in new_leads:
            print(f"Processing NEW lead: {lead.name}")
            # Trigger Call
            call_vapi(lead.phone)
            # Update Status
            lead.status = LeadStatus.CONTACTING
            db.commit()
            print(f"Lead {lead.name} moved to CONTACTING")

        # 2. CONTACTING -> NURTURING (if call failed)
        # We simulate a check: query leads in CONTACTING.
        # Ideally, we would need to check call status from Vapi webhook.
        # For this state machine demo, we assume they failed and need SMS.
        contacting_leads = db.query(Lead).filter(Lead.status == LeadStatus.CONTACTING).all()
        for lead in contacting_leads:
            print(f"Processing CONTACTING lead: {lead.name}")
            # Check call status... (Simulated as failed)
            call_failed = True 
            if call_failed:
                send_sms(lead.phone, "Hey! Sorry we missed you. When is a good time to chat?")
                lead.status = LeadStatus.NURTURING
                db.commit()
                print(f"Lead {lead.name} moved to NURTURING")

        # 3. NURTURING -> BOOKED (if replied)
        # This usually requires an inbound webhook from Twilio.
        # We will Mock this: if lead note contains "REPLIED", move to BOOKED.
        nurturing_leads = db.query(Lead).filter(Lead.status == LeadStatus.NURTURING).all()
        for lead in nurturing_leads:
            if lead.notes and "REPLIED" in lead.notes:
                print(f"[Admin Alert] Lead {lead.name} has replied!")
                lead.status = LeadStatus.BOOKED
                db.commit()
                print(f"Lead {lead.name} moved to BOOKED")

    except Exception as e:
        print(f"Error in process_leads: {e}")
    finally:
        db.close()
