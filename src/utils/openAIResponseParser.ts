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
  const sections = content.split(/(?=\d+\.\s+|#{1,3}\s+|Marketing Hooks|SEO Descriptions|Meta Description)/i);
  
  sections.forEach(section => {
    const cleanSection = section.trim();
    
    // Parse SEO Title
    if (cleanSection.match(/SEO Title|Title Options/i)) {
      const titles = cleanSection.match(/"([^"]+)"/g) || [];
      result.newTitle = titles[0]?.replace(/"/g, '') || '';
    }
    
    // Parse Marketing Hooks
    if (cleanSection.match(/Marketing Hooks/i)) {
      result.marketingHooks = cleanSection
        .split(/\d+\.\s+/)
        .map(hook => hook.replace(/["'\n]/g, '').trim())
        .filter(hook => hook && !hook.match(/Marketing Hooks/i));
    }
    
    // Parse SEO Descriptions
    if (cleanSection.match(/SEO Descriptions/i)) {
      result.seoDescriptions = cleanSection
        .split(/\d+\.\s+/)
        .map(desc => desc.replace(/["'\n]/g, '').trim())
        .filter(desc => desc && !desc.match(/SEO Descriptions/i));
    }
    
    // Parse Meta Description
    if (cleanSection.match(/Meta Description/i)) {
      const metaMatch = cleanSection.match(/"([^"]+)"/);
      if (metaMatch) {
        result.metaDescription = metaMatch[1].trim();
      }
    }
  });

  console.log("Parsed result:", result);
  return result;
}