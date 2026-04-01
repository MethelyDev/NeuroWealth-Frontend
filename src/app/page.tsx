import { redirect } from "next/navigation";

// Root page — forward to dashboard (middleware handles auth gate)
export default function HomePage() {
  redirect("/dashboard");
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/features/landing/HeroSection";
import { FeaturesSection } from "@/features/landing/FeaturesSection";
import { HowItWorksSection } from "@/features/landing/HowItWorksSection";
import { StrategiesSection } from "@/features/landing/StrategiesSection";
import { SecuritySection } from "@/features/landing/SecuritySection";
import { CtaSection } from "@/features/landing/CtaSection";
import { HomeFooter } from "@/features/landing/HomeFooter";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* Overview */}
        <HeroSection />

        {/* Features */}
        <FeaturesSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Strategies */}
        <StrategiesSection />

        {/* Security */}
        <SecuritySection />

        {/* Final CTA */}
        <CtaSection />
      </main>

      <HomeFooter />
    </>
  );
}
