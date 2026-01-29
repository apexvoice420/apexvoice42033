from sqlalchemy import Column, Integer, String, Enum, DateTime, Text, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import enum
from datetime import datetime

import os

if os.environ.get("VERCEL"):
    DATABASE_URL = "sqlite:////tmp/leads.db"
else:
    DATABASE_URL = "sqlite:///./leads.db"

Base = declarative_base()
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class LeadStatus(str, enum.Enum):
    NEW = "NEW"
    CONTACTING = "CONTACTING"
    NURTURING = "NURTURING"
    BOOKED = "BOOKED"
    DEAD = "DEAD"

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String, index=True)
    email = Column(String, index=True)
    status = Column(Enum(LeadStatus), default=LeadStatus.NEW)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    trigger_type = Column(String, default="GOOGLE_SHEET_IMPORT") # e.g. GOOGLE_SHEET_IMPORT
    config = Column(Text, nullable=True) # JSON or simple string (e.g., sheet_id)
    status = Column(String, default="ACTIVE") # ACTIVE, PAUSED
    last_run = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_db():
    Base.metadata.create_all(bind=engine)
