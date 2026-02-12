# Apex Voice Solutions - Agents & Architecture

## 1. Agent A: Frontend Architect (The "GoHighLevel" Dashboard)
**Primary Task:** Build the admin dashboard at `admin.apexvoicesolutions.org/dashboard`
**Design Requirements:**
- **Layout:** Professional SaaS dashboard with responsive design
- **Sidebar Navigation:** Launchpad, Lead Scraper, Contacts, Conversations, Campaigns, Calendar, Reports, Automation, Team, Settings.
- **Tech Stack:** Next.js 14+, Tailwind CSS, shadcn/ui.

## 2. Agent B: Backend Logic Engineer (The "n8n Replacement")
**Primary Task:** Build comprehensive automation logic using Firebase Cloud Functions.
**Functions:**
- `startOutboundCampaign`: Trigger VAPI calls.
- `vapiWebhookHandler`: Process call outcomes.
- `testModeSimulator`: Simulate calls.
- `sendEmail` / `sendSMS`: Communication.
- `calculateLeadScore`: Intelligence.
- `processWorkflow`: Automation engine.

## 3. Agent C: Lead Acquisition Engine (GMB Scraper)
**Primary Task:** Build a Google My Business scraper.
**Features:**
- Dynamic Location System (City/State).
- Target Niches (Plumbers, Roofers, etc.).
- Live Progress Updates via SSE.

## 4. Agent D: Deployment & Infrastructure Manager
**Primary Task:** Configure project for Vercel deployment.
**Deliverables:**
- `vercel.json` configuration.
- Custom domain setup (`apexvoicesolutions.org`, `admin.apexvoicesolutions.org`).
- Environment variable management.
