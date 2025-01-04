import { SeoTitlesSection } from "./sections/SeoTitlesSection";
import { MarketingHooksSection } from "./sections/MarketingHooksSection";
import { SeoDescriptionsSection } from "./sections/SeoDescriptionsSection";
import { MetaDescriptionSection } from "./sections/MetaDescriptionSection";

interface GeneratedContentProps {
  content: {
    marketingHooks: string[];
    seoDescriptions: string[];
    metaDescription: string;
    seoTitles: string[];
  };
}

export function GeneratedContent({ content }: GeneratedContentProps) {
  // Destructuring with default values to handle undefined properties
  const {
    marketingHooks = [],
    seoDescriptions = [],
    metaDescription = '',
    seoTitles = [],
  } = content || { marketingHooks: [], seoDescriptions: [], metaDescription: '', seoTitles: [] };

  console.log("GeneratedContent received:", content);

  return (
    <div className="space-y-8">
      <SeoTitlesSection titles={seoTitles} />
      <MarketingHooksSection hooks={marketingHooks} />
      <SeoDescriptionsSection descriptions={seoDescriptions} />
      <MetaDescriptionSection description={metaDescription} />
    </div>
  );
}