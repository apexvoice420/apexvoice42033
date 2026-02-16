import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample leads for demo
  const leads = [
    {
      businessName: 'Apex Roofing Co',
      phone: '+15551234567',
      email: 'contact@apexroofing.com',
      city: 'Atlanta',
      state: 'GA',
      niche: 'Roofing',
      rating: 4.8,
      reviewCount: 127,
      status: 'New Lead',
      source: 'Google Maps'
    },
    {
      businessName: 'Quick Fix Plumbing',
      phone: '+15559876543',
      email: 'info@quickfixplumb.com',
      city: 'Miami',
      state: 'FL',
      niche: 'Plumbing',
      rating: 4.6,
      reviewCount: 89,
      status: 'Contacted',
      source: 'Google Maps'
    },
    {
      businessName: 'Cool Air HVAC',
      phone: '+15554567890',
      email: 'service@coolairhvac.com',
      city: 'Houston',
      state: 'TX',
      niche: 'HVAC',
      rating: 4.9,
      reviewCount: 203,
      status: 'Qualified',
      source: 'Referral'
    }
  ]

  for (const lead of leads) {
    await prisma.lead.upsert({
      where: { phone: lead.phone },
      update: {},
      create: lead
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
