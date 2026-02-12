import sys
import os

# Point to the app directory
# This path is relative to 'api/index.py' -> needs to go up one level, then to src/...
app_dir = os.path.join(os.path.dirname(__file__), '../src/components/Crm/apex-lead-os')
sys.path.append(app_dir)

from main import app
