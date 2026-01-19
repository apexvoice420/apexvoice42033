import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import { SocialProof, FinalCTA } from '@/components/SocialCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <SocialProof />
      <FinalCTA />
    </main>
  );
}
