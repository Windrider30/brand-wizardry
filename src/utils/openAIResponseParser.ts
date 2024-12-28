interface ParsedProductDescription {
  marketingHooks: string[];
  seoDescriptions: string[];
  metaDescription: string;
  newTitle: string;
}

export function parseProductDescription(content: string): ParsedProductDescription {
  console.log("Parsing content:", content);
  
  // Initialize default values
  const result: ParsedProductDescription = {
    marketingHooks: [],
    seoDescriptions: [],
    metaDescription: "",
    newTitle: ""
  };

  // Split content into sections by numbered headers or markdown headers
  const sections = content.split(/(?=\d+\.\s+|#{1,3}\s+)/);
  
  sections.forEach(section => {
    const cleanSection = section.trim();
    
    if (cleanSection.match(/SEO Title|Title Options/i)) {
      const titles = cleanSection.match(/"([^"]+)"/g) || [];
      result.newTitle = titles[0]?.replace(/"/g, '') || '';
    }
    
    if (cleanSection.match(/Marketing Hooks/i)) {
      result.marketingHooks = (cleanSection.match(/"([^"]+)"/g) || [])
        .map(hook => hook.replace(/"/g, '').trim())
        .filter(Boolean);
    }
    
    if (cleanSection.match(/SEO Descriptions/i)) {
      result.seoDescriptions = (cleanSection.match(/"([^"]+)"/g) || [])
        .map(desc => desc.replace(/"/g, '').trim())
        .filter(Boolean);
    }
    
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