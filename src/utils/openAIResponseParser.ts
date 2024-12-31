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
    let currentDescription = "";
    
    sections.forEach(section => {
      const cleanSection = section.trim();
      console.log("Processing section:", cleanSection);
      
      if (cleanSection.includes("SEO Title Options")) {
        currentSection = "titles";
      } else if (cleanSection.includes("Marketing Hooks")) {
        currentSection = "hooks";
      } else if (cleanSection.includes("SEO Descriptions")) {
        currentSection = "descriptions";
      } else if (cleanSection.includes("Meta Description")) {
        currentSection = "meta";
      } else if (cleanSection && currentSection) {
        switch (currentSection) {
          case "titles":
            // Extract titles (removing numbers and quotes)
            const titles = cleanSection
              .split('\n')
              .map(line => line.replace(/^\d+\.\s*"|"$/g, '').trim())
              .filter(title => title && !title.includes("SEO Title Options"));
            if (titles.length > 0) {
              result.newTitle = titles.join('\n');
            }
            break;
            
          case "hooks":
            // Extract hooks (removing asterisks and quotes)
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
            // Handle description versions
            if (cleanSection.startsWith("**Version")) {
              if (currentDescription) {
                result.seoDescriptions.push(currentDescription.trim());
              }
              currentDescription = "";
            } else if (!cleanSection.includes("SEO Descriptions") && cleanSection) {
              if (currentDescription) {
                currentDescription += "\n\n";
              }
              currentDescription += cleanSection;
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

    // Add the last description if there is one
    if (currentDescription) {
      result.seoDescriptions.push(currentDescription.trim());
    }
  } catch (error) {
    console.error("Error parsing product description:", error);
  }

  console.log("Final parsed result:", result);
  return result;
}