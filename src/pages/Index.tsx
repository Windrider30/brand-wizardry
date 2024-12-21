import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, MessageSquare, Mail, Tag, Target, FileText } from "lucide-react";
import { PricingCard } from "@/components/pricing/PricingCard";
import { DurationToggle } from "@/components/pricing/DurationToggle";
import { useState } from "react";

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
        
        <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 max-w-6xl mx-auto mt-8">
          <div className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-[#0EA5E9] mx-auto mb-3 md:mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#0EA5E9]">Brand Bible</h2>
            <p className="text-base md:text-lg text-black mb-4">Define your brand's voice, values, and vision</p>
            <Link to="/brand-bible" className="block">
              <Button variant="outline" className="w-full text-base md:text-lg border-black">Get Started</Button>
            </Link>
          </div>

          <div className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Tag className="w-8 h-8 md:w-12 md:h-12 text-[#0EA5E9] mx-auto mb-3 md:mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#0EA5E9]">Product Descriptions</h2>
            <p className="text-base md:text-lg text-black mb-4">Generate compelling product content</p>
            <Link to="/product-description" className="block">
              <Button variant="outline" className="w-full text-base md:text-lg border-black">Get Started</Button>
            </Link>
          </div>

          <div className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <MessageSquare className="w-8 h-8 md:w-12 md:h-12 text-[#0EA5E9] mx-auto mb-3 md:mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#0EA5E9]">Social Posts</h2>
            <p className="text-base md:text-lg text-black mb-4">Generate content for Facebook, Instagram, and Pinterest</p>
            <Link to="/social-posts" className="block">
              <Button variant="outline" className="w-full text-base md:text-lg border-black">Get Started</Button>
            </Link>
          </div>

          <div className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Mail className="w-8 h-8 md:w-12 md:h-12 text-[#0EA5E9] mx-auto mb-3 md:mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#0EA5E9]">Email Content</h2>
            <p className="text-base md:text-lg text-black mb-4">Create compelling email campaigns</p>
            <Link to="/email-content" className="block">
              <Button variant="outline" className="w-full text-base md:text-lg border-black">Get Started</Button>
            </Link>
          </div>

          <div className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Target className="w-8 h-8 md:w-12 md:h-12 text-[#0EA5E9] mx-auto mb-3 md:mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#0EA5E9]">Ad Generation</h2>
            <p className="text-base md:text-lg text-black mb-4">Create Facebook and Instagram ads</p>
            <Link to="/ad-generation" className="block">
              <Button variant="outline" className="w-full text-base md:text-lg border-black">Get Started</Button>
            </Link>
          </div>

          <div className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FileText className="w-8 h-8 md:w-12 md:h-12 text-[#0EA5E9] mx-auto mb-3 md:mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#0EA5E9]">SEO Articles</h2>
            <p className="text-base md:text-lg text-black mb-4">Generate optimized content for your blog</p>
            <Link to="/seo-article" className="block">
              <Button variant="outline" className="w-full text-base md:text-lg border-black">Get Started</Button>
            </Link>
          </div>
        </div>

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

        <div className="mt-12 md:mt-16 text-xs md:text-sm text-gray-500">
          Powered by EcomCavalry
        </div>
      </div>
    </div>
  );
};

export default Index;