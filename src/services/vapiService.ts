import { Lead, LeadStatus } from '@/types';

export const triggerVapiCall = async (lead: Lead, useTest: boolean): Promise<LeadStatus> => {
    console.log('Triggering Vapi call for:', lead.businessName, 'Test mode:', useTest);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return LeadStatus.CALLED;
};
