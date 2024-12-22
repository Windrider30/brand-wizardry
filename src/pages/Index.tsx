import { useState } from "react";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { PricingCard } from "@/components/pricing/PricingCard";
import { DurationToggle } from "@/components/pricing/DurationToggle";
import { CancelSubscription } from "@/components/home/CancelSubscription";

const Index = () => {
  const [duration, setDuration] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  const getPriceForDuration = (basePrice: number) => {
    if (basePrice === 15) { // Beginner tier
      switch (duration) {
        case 'quarterly':
          return '$36 USD';
        case 'yearly':
          return '$108 USD';
        default:
          return '$15 USD';
      }
    } else { // Professional tier
      switch (duration) {
        case 'quarterly':
          return '$60 USD';
        case 'yearly':
          return '$180 USD';
        default:
          return '$25 USD';
      }
    }
  };

  const beginnerFeatures = [
    { name: "Brand Bibles", limit: 2 },
    { name: "Product Descriptions", limit: 25 },
    { name: "Social Posts", limit: 10 },
    { name: "Email Posts", limit: 10 },
    { name: "Ad Generations", limit: 10 },
    { name: "Blog Posts", limit: 20 },
  ];

  const professionalFeatures = [
    { name: "Brand Bibles", limit: 15 },
    { name: "Product Descriptions", limit: 50 },
    { name: "Social Posts", limit: 25 },
    { name: "Email Posts", limit: 20 },
    { name: "Ad Generations", limit: 30 },
    { name: "Blog Posts", limit: 40 },
  ];

  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="text-center space-y-4 md:space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold">Welcome to Brand Forge Foundry</h1>
        <p className="text-xl md:text-2xl font-semibold text-black">Elevate Your Brand, Elevate Your Sales</p>
        <p className="text-lg md:text-xl text-black max-w-2xl mx-auto">
          Create your brand bible and generate on-brand content using the power of AI
        </p>
        
        <FeaturesGrid />

        {/* Pricing Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-12">Choose Your Plan</h2>
          <DurationToggle duration={duration} onDurationChange={setDuration} />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              title="Beginner"
              price={getPriceForDuration(15)}
              features={beginnerFeatures}
              tier="beginner"
              duration={duration}
            />
            <PricingCard
              title="Professional"
              price={getPriceForDuration(25)}
              features={professionalFeatures}
              tier="professional"
              duration={duration}
            />
          </div>
        </div>

        <CancelSubscription />

        <div className="mt-12 md:mt-16 text-xs md:text-sm text-gray-500">
          Powered by EcomCavalry
        </div>
      </div>
    </div>
  );
};

export default Index;