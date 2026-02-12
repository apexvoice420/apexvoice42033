import gspread
from google.oauth2.service_account import Credentials
import os

class GoogleSheetsClient:
    def __init__(self, credentials_path="service_account.json"):
        self.scope = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"]
        
        # Check if credential file exists
        if os.path.exists(credentials_path):
            self.creds = Credentials.from_service_account_file(credentials_path, scopes=self.scope)
            self.client = gspread.authorize(self.creds)
            self.is_connected = True
        else:
            print(f"[GoogleSheets] Warning: {credentials_path} not found. Running in MOCK mode.")
            self.is_connected = False
            self.client = None

    def get_rows(self, sheet_id, worksheet_name=None):
        """
        Reads all rows from a sheet.
        If mock mode, returns dummy data.
        """
        if not self.is_connected:
            # Mock Data
            return [
                {"name": "Mock Lead 1", "phone": "+15550001", "email": "mock1@example.com", "notes": "Imported from Mock Sheet"},
                {"name": "Mock Lead 2", "phone": "+15550002", "email": "mock2@example.com", "notes": "Imported from Mock Sheet"}
            ]
        
        try:
            sheet = self.client.open_by_key(sheet_id)
            if worksheet_name:
                worksheet = sheet.worksheet(worksheet_name)
            else:
                worksheet = sheet.sheet1
            
            return worksheet.get_all_records()
        except Exception as e:
            print(f"[GoogleSheets] Error reading sheet: {e}")
            return []
