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
  return titleSection
    ?.split('\n')
    .filter(line => line.trim() && !line.toLowerCase().includes('seo title'))
    .map(line => line.replace(/^\*\*|\*\*$/g, '').trim())[0] || '';
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
  return sections
    .filter(section => 
      section.toLowerCase().includes('option') && 
      !section.toLowerCase().includes('meta description')
    )
    .map(section => {
      const lines = section.split('\n')
        .filter(line => !line.toLowerCase().startsWith('option'))
        .join(' ');
      return lines
        .replace(/\*\*|\*/g, '')
        .replace(/^#+ /g, '')
        .trim();
    })
    .filter(Boolean);
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