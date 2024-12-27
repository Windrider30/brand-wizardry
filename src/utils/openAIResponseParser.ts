interface ParsedProductDescription {
  marketingHooks: string[];
  seoDescriptions: string[];
  metaDescription: string;
  newTitle: string;
}

export function parseProductDescription(content: string): ParsedProductDescription {
  // Split content into sections and filter out empty strings
  const sections = content.split(/\d+\.\s+/).filter(Boolean);
  
  // Extract title from the first section (SEO Title Options)
  const titles = sections[0]?.match(/\"([^"]+)\"/g) || [];
  const newTitle = titles[0]?.replace(/"/g, '') || '';

  // Extract marketing hooks from the second section
  const hooksSection = sections[1] || '';
  const marketingHooks = hooksSection
    .match(/\d+\.\s+"([^"]+)"/g)
    ?.map(hook => hook.replace(/^\d+\.\s+"/, '').replace(/"$/, ''))
    || [];

  // Extract SEO descriptions from the third section
  const descriptionsSection = sections[2] || '';
  const seoDescriptions = descriptionsSection
    .match(/\d+\.\s+"([^"]+)"/g)
    ?.map(desc => desc.replace(/^\d+\.\s+"/, '').replace(/"$/, ''))
    || [];

  // Extract meta description from the fourth section
  const metaDescription = (sections[3]?.match(/\"([^"]+)\"/) || [])[1] || '';

  return {
    marketingHooks,
    seoDescriptions,
    metaDescription,
    newTitle
  };
}