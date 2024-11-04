import { TranslatorHero } from '@/components/translator-hero';
import { Features } from '@/components/features';
import { LanguageSupport } from '@/components/language-support';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <TranslatorHero />
      <Features />
      <LanguageSupport />
      <Footer />
    </main>
  );
}