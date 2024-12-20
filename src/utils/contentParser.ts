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
  // Find the section that starts with "SEO Descriptions"
  const descriptionSectionIndex = sections.findIndex(s => 
    s.toLowerCase().includes('seo descriptions')
  );
  
  if (descriptionSectionIndex === -1) return [];
  
  // Get all sections after "SEO Descriptions" that contain "Description Option" or start with "Option"
  const descriptions: string[] = [];
  let currentDescription = '';
  
  for (let i = descriptionSectionIndex + 1; i < sections.length; i++) {
    const section = sections[i];
    
    // Stop if we hit another major section
    if (section.toLowerCase().includes('meta description')) break;
    
    // If this section contains a description option
    if (section.toLowerCase().includes('description option') || 
        section.toLowerCase().startsWith('option')) {
      if (currentDescription) {
        descriptions.push(currentDescription.trim());
        currentDescription = '';
      }
      // Remove the "Description Option X" or "Option X" header and clean the text
      currentDescription = section
        .replace(/###?\s*Description Option \d+/i, '')
        .replace(/Option \d+/i, '')
        .replace(/\*\*|\*/g, '')
        .trim();
    } else if (currentDescription) {
      // Append to current description if we're in the middle of one
      currentDescription += ' ' + section.replace(/\*\*|\*/g, '').trim();
    }
  }
  
  // Add the last description if there is one
  if (currentDescription) {
    descriptions.push(currentDescription.trim());
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