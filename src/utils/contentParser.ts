interface ParsedContent {
  title: string;
  marketingHooks: string[];
  seoDescriptions: string[];
  metaDescription: string;
}

export function parseOpenAIResponse(content: string): ParsedContent {
  console.log("Raw content from OpenAI:", content);
  
  const sections = content.split('\n\n').filter(Boolean);
  console.log("Split sections:", sections);

  const result = {
    title: extractTitle(sections),
    marketingHooks: extractMarketingHooks(sections),
    seoDescriptions: extractSEODescriptions(sections),
    metaDescription: extractMetaDescription(sections),
  };

  console.log("Parsed result:", result);
  return result;
}

function extractTitle(sections: string[]): string {
  const titleSection = sections.find(s => 
    s.toLowerCase().includes('seo title') || 
    s.toLowerCase().includes('title options')
  );
  
  if (!titleSection) {
    console.log("No title section found");
    return '';
  }
  
  const lines = titleSection.split('\n')
    .filter(line => line.trim() && !line.toLowerCase().includes('seo title') && !line.toLowerCase().includes('title options'))
    .map(line => line.replace(/^\d+\.\s*"|"$|^\d+\.\s*/g, '').trim());
  
  console.log("Extracted title lines:", lines);
  return lines[0] || '';
}

function extractMarketingHooks(sections: string[]): string[] {
  const hooksSection = sections.find(s => 
    s.toLowerCase().includes('marketing hooks')
  );
  
  if (!hooksSection) {
    console.log("No marketing hooks section found");
    return [];
  }
  
  const hooks = hooksSection
    .split('\n')
    .filter(line => line.trim() && !line.toLowerCase().includes('marketing hooks'))
    .map(line => line.replace(/^\d+\.\s*"|"$|^\*\*.*\*\*$|^[-*]\s*/g, '').trim())
    .filter(hook => hook && !hook.toLowerCase().includes('marketing hooks'));
  
  console.log("Extracted marketing hooks:", hooks);
  return hooks;
}

function extractSEODescriptions(sections: string[]): string[] {
  const descriptions: string[] = [];
  let isInDescriptionSection = false;
  
  for (const section of sections) {
    if (section.toLowerCase().includes('seo descriptions')) {
      isInDescriptionSection = true;
      continue;
    }
    
    if (isInDescriptionSection && 
        !section.toLowerCase().includes('meta description') &&
        section.trim().length > 0) {
      const cleanedDescription = section
        .replace(/^Version \d+:?/i, '')
        .replace(/^\d+\.\s*/g, '')
        .replace(/\*\*.*\*\*/, '')
        .trim();
      
      if (cleanedDescription) {
        descriptions.push(cleanedDescription);
      }
    }
    
    if (isInDescriptionSection && section.toLowerCase().includes('meta description')) {
      break;
    }
  }
  
  console.log("Extracted SEO descriptions:", descriptions);
  return descriptions;
}

function extractMetaDescription(sections: string[]): string {
  const metaSection = sections.find(s => 
    s.toLowerCase().includes('meta description')
  );
  
  if (!metaSection) {
    console.log("No meta description section found");
    return '';
  }
  
  const lines = metaSection.split('\n')
    .filter(line => line.trim() && !line.toLowerCase().includes('meta description'))
    .map(line => line.replace(/^\d+\.\s*"|"$|^\*\*.*\*\*$/g, '').trim());
  
  const metaDescription = lines[0] || '';
  console.log("Extracted meta description:", metaDescription);
  return metaDescription;
}