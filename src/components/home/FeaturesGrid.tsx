import { BookOpen, MessageSquare, Mail, Tag, Target, FileText } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: BookOpen,
    title: "Brand Bible",
    description: "Define your brand's voice, values, and vision",
    route: "/brand-bible"
  },
  {
    icon: Tag,
    title: "Product Descriptions",
    description: "Generate compelling product content",
    route: "/product-description"
  },
  {
    icon: MessageSquare,
    title: "Social Posts",
    description: "Generate content for Facebook, Instagram, and Pinterest",
    route: "/social-posts"
  },
  {
    icon: Mail,
    title: "Email Content",
    description: "Create compelling email campaigns",
    route: "/email-content"
  },
  {
    icon: Target,
    title: "Ad Generation",
    description: "Create Facebook and Instagram ads",
    route: "/ad-generation"
  },
  {
    icon: FileText,
    title: "SEO Articles",
    description: "Generate optimized content for your blog",
    route: "/seo-article"
  }
];

export const FeaturesGrid = () => {
  return (
    <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 max-w-6xl mx-auto mt-8">
      {features.map((feature) => (
        <FeatureCard key={feature.route} {...feature} />
      ))}
    </div>
  );
};