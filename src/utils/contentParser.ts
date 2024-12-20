interface ParsedContent {
  title: string;
  marketingHooks: string[];
  seoDescriptions: string[];
  metaDescription: string;
}

export function parseOpenAIResponse(content: string): ParsedContent {
  const sections = content.split('\n\n').filter(Boolean);
  console.log("Parsed sections:", sections);

  return {
    title: extractTitle(sections),
    marketingHooks: extractMarketingHooks(sections),
    seoDescriptions: extractSEODescriptions(sections),
    metaDescription: extractMetaDescription(sections),
  };
}

function extractTitle(sections: string[]): string {
  const titleSection = sections.find(s => s.toLowerCase().includes('seo title'));
  if (!titleSection) return '';
  
  const lines = titleSection.split('\n')
    .filter(line => line.trim() && !line.toLowerCase().includes('seo title'))
    .map(line => line.replace(/^\d+\.\s*"|"$/g, '').trim());
  
  return lines[0] || '';
}

function extractMarketingHooks(sections: string[]): string[] {
  const hooksSection = sections.find(s => s.toLowerCase().includes('marketing hooks'));
  return hooksSection
    ?.split('\n')
    .filter(line => line.startsWith('-') || line.match(/^\d+\./))
    .map(hook => hook.replace(/^[-\d.\s]+/, '').trim())
    .map(hook => hook.replace(/\*\*|\*/g, ''))
    .map(hook => hook.replace(/^["']|["']$/g, '')) || [];
}

function extractSEODescriptions(sections: string[]): string[] {
  // Find the SEO Descriptions section
  const descriptionSectionIndex = sections.findIndex(s => 
    s.toLowerCase().includes('seo descriptions') && !s.toLowerCase().includes('meta')
  );
  
  if (descriptionSectionIndex === -1) return [];
  
  const descriptions: string[] = [];
  
  // Start from the section after "SEO Descriptions"
  for (let i = descriptionSectionIndex + 1; i < sections.length; i++) {
    const section = sections[i];
    
    // Stop if we hit another major section
    if (section.toLowerCase().includes('meta description') || 
        section.toLowerCase().includes('feel free to choose')) {
      break;
    }
    
    // Skip sections that contain SEO Title Options
    if (section.toLowerCase().includes('seo title')) {
      continue;
    }
    
    // Only process sections that contain actual descriptions
    if (section.toLowerCase().includes('option') || 
        section.match(/^###?\s*Option/i)) {
      const cleanedDescription = section
        .replace(/^###?\s*Option \d+/i, '')
        .replace(/^Option \d+:?/i, '')
        .replace(/\*\*|\*/g, '')
        .trim();
      
      if (cleanedDescription) {
        descriptions.push(cleanedDescription);
      }
    }
  }
  
  return descriptions;
}

function extractMetaDescription(sections: string[]): string {
  const metaSection = sections.find(s => s.toLowerCase().includes('meta description'));
  return metaSection
    ?.split('\n')
    .slice(1)
    .join(' ')
    .replace(/\*\*|\*/g, '')
    .replace(/^["']|["']$/g, '')
    .trim() || '';
}