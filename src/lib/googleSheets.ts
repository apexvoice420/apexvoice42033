// Google Sheets Integration - Apex Voice CRM
const SHEET_ID = '1m7_MitK4EbKAOlYyz2S6LpH6ekxiZcy697SLL5vjw9s';

export interface SheetLead {
  date: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  status: string;
  niche: string;
}

export async function fetchLeadsFromSheet(): Promise<SheetLead[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
  
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const text = await res.text();
    
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length <= 1) return [];
    
    const leads: SheetLead[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
      if (cols[1]) {
        leads.push({
          date: cols[0] || '',
          name: cols[1] || '',
          email: cols[2] || '',
          phone: cols[3] || '',
          company: cols[4] || '',
          message: cols[5] || '',
          status: cols[6] || 'New Lead',
          niche: cols[7] || ''
        });
      }
    }
    return leads;
  } catch (e) {
    console.error('Sheet fetch error:', e);
    return [];
  }
}
