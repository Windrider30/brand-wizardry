interface ParsedProductDescription {
  marketingHooks: string[];
  seoDescriptions: string[];
  metaDescription: string;
  newTitle: string;
}

export function parseProductDescription(content: string): ParsedProductDescription {
  console.log("Raw content received for parsing:", content);
  
  const result: ParsedProductDescription = {
    marketingHooks: [],
    seoDescriptions: [],
    metaDescription: "",
    newTitle: ""
  };

  try {
    // Split content into sections
    const sections = content.split(/\n\n|\r\n\r\n/);
    console.log("Split sections:", sections);
    
    sections.forEach(section => {
      const cleanSection = section.trim();
      console.log("Processing section:", cleanSection);
      
      // Parse SEO Title
      if (cleanSection.match(/SEO Title|Title Options/i)) {
        const titles = cleanSection
          .split(/\d+\.\s+/)
          .slice(1)
          .map(title => title.trim())
          .filter(Boolean);
        if (titles.length > 0) {
          result.newTitle = titles.join('\n');
          console.log("Found titles:", titles);
        }
      }
      
      // Parse Marketing Hooks
      if (cleanSection.match(/Marketing Hooks/i)) {
        const hooks = cleanSection
          .split(/\d+\.\s+/)
          .slice(1)
          .map(hook => hook.trim())
          .filter(Boolean);
        result.marketingHooks = hooks;
        console.log("Found marketing hooks:", hooks);
      }
      
      // Parse SEO Descriptions
      if (cleanSection.match(/SEO Descriptions?/i)) {
        const descriptions = cleanSection
          .split(/Version \d+:|^\d+\.\s+/m)
          .slice(1)
          .map(desc => desc.trim())
          .filter(desc => desc.length >= 150);
        result.seoDescriptions = descriptions;
        console.log("Found SEO descriptions:", descriptions);
      }
      
      // Parse Meta Description
      if (cleanSection.match(/Meta Description/i)) {
        const metaMatch = cleanSection.match(/(?<=Meta Description:?\s+).*$/m);
        if (metaMatch) {
          result.metaDescription = metaMatch[0].trim();
          console.log("Found meta description:", result.metaDescription);
        }
      }
    });
  } catch (error) {
    console.error("Error parsing product description:", error);
  }

  console.log("Final parsed result:", result);
  return result;
}