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
    
    let currentSection = "";
    
    sections.forEach(section => {
      const cleanSection = section.trim();
      
      // Parse SEO Title Options
      if (cleanSection.includes("SEO Title Options")) {
        currentSection = "titles";
      } else if (cleanSection.includes("Marketing Hooks")) {
        currentSection = "hooks";
      } else if (cleanSection.includes("SEO Descriptions")) {
        currentSection = "descriptions";
      } else if (cleanSection.includes("Meta Description")) {
        currentSection = "meta";
      } else if (cleanSection.startsWith("---")) {
        currentSection = "";
      } else if (currentSection && cleanSection) {
        switch (currentSection) {
          case "titles":
            // Extract titles (removing numbers and quotes)
            const titles = cleanSection
              .split('\n')
              .map(line => line.replace(/^\d+\.\s*"|"$/, '').trim())
              .filter(title => title && !title.includes("SEO Title Options"));
            if (titles.length > 0) {
              result.newTitle = titles.join('\n');
            }
            break;
            
          case "hooks":
            // Extract hooks (removing asterisks and "Hook:" prefix)
            const hook = cleanSection
              .replace(/\*\*/g, '')
              .replace(/Hook:\s*"/g, '')
              .replace(/"$/g, '')
              .trim();
            if (hook && !hook.includes("Marketing Hooks")) {
              result.marketingHooks.push(hook);
            }
            break;
            
          case "descriptions":
            // Extract descriptions (removing version numbers and asterisks)
            if (cleanSection.includes("Description:")) {
              const description = cleanSection
                .replace(/^\d+\.\s*\*\*Description:\*\*\s+/g, '')
                .trim();
              if (description) {
                result.seoDescriptions.push(description);
              }
            }
            break;
            
          case "meta":
            // Extract meta description (removing quotes)
            const meta = cleanSection.replace(/^"|"$/g, '').trim();
            if (meta && !meta.includes("Meta Description")) {
              result.metaDescription = meta;
            }
            break;
        }
      }
    });
  } catch (error) {
    console.error("Error parsing product description:", error);
  }

  console.log("Final parsed result:", result);
  return result;
}