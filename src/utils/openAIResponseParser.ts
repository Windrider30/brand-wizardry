interface ParsedProductDescription {
  marketingHooks: string[];
  seoDescriptions: string[];
  metaDescription: string;
  newTitle: string;
}

export function parseProductDescription(content: string): ParsedProductDescription {
  console.log("Parsing content:", content);
  
  const result: ParsedProductDescription = {
    marketingHooks: [],
    seoDescriptions: [],
    metaDescription: "",
    newTitle: ""
  };

  // Split content into sections
  const sections = content.split(/\n\n|\r\n\r\n/);
  
  sections.forEach(section => {
    const cleanSection = section.trim();
    
    // Parse SEO Title
    if (cleanSection.match(/SEO Title Options|Title Options/i)) {
      const titles = cleanSection.match(/(?<=\d\.\s+).*$/gm) || [];
      result.newTitle = titles[0]?.trim() || '';
    }
    
    // Parse Marketing Hooks
    if (cleanSection.match(/Marketing Hooks/i)) {
      result.marketingHooks = cleanSection
        .split(/\d+\.\s+/)
        .slice(1) // Remove the header
        .map(hook => hook.trim())
        .filter(Boolean);
    }
    
    // Parse SEO Descriptions
    if (cleanSection.match(/SEO Descriptions/i)) {
      result.seoDescriptions = cleanSection
        .split(/\d+\.\s+/)
        .slice(1) // Remove the header
        .map(desc => desc.trim())
        .filter(desc => desc && desc.length >= 200);
    }
    
    // Parse Meta Description
    if (cleanSection.match(/Meta Description/i)) {
      const metaMatch = cleanSection.match(/(?<=Meta Description:?\s+).*$/m);
      if (metaMatch) {
        result.metaDescription = metaMatch[0].trim();
      }
    }
  });

  console.log("Parsed result:", result);
  return result;
}