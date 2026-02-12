# Use an official Python runtime with Playwright pre-installed or install it
# We use the official Playwright image to ensure all browser deps are present
FROM mcr.microsoft.com/playwright/python:v1.40.0-jammy

WORKDIR /app

# Copy requirements files from both locations
COPY ./requirements.txt /app/requirements.txt
COPY ./scraper/requirements.txt /app/scraper_requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r scraper_requirements.txt

# Copy source code
COPY . /app

# Expose port (Cloud Run expects 8080 by default, but we can config)
ENV PORT=8080
EXPOSE 8080

# Run command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
