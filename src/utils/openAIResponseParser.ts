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
    let isCollectingDescription = false;
    
    sections.forEach(section => {
      const cleanSection = section.trim();
      
      if (cleanSection.includes("SEO Title Options")) {
        currentSection = "titles";
        isCollectingDescription = false;
      } else if (cleanSection.includes("Marketing Hooks")) {
        currentSection = "hooks";
        isCollectingDescription = false;
      } else if (cleanSection.includes("SEO Descriptions")) {
        currentSection = "descriptions";
        isCollectingDescription = false;
      } else if (cleanSection.includes("Meta Description")) {
        currentSection = "meta";
        isCollectingDescription = false;
      } else if (cleanSection && currentSection) {
        switch (currentSection) {
          case "titles":
            if (!cleanSection.includes("SEO Title Options")) {
              const titles = cleanSection
                .split('\n')
                .map(line => line.replace(/^\d+\.\s*"|"$/g, '').trim())
                .filter(title => title && !title.includes("SEO Title Options"));
              if (titles.length > 0) {
                result.newTitle = titles.join('\n');
              }
            }
            break;
            
          case "hooks":
            if (!cleanSection.includes("Marketing Hooks")) {
              const hook = cleanSection
                .replace(/^\d+\.\s*/, '')
                .replace(/\*\*.*?\*\*:\s*/, '')
                .replace(/^"|"$/g, '')
                .trim();
              if (hook) {
                result.marketingHooks.push(hook);
              }
            }
            break;
            
          case "descriptions":
            if (cleanSection.startsWith("**Version")) {
              if (currentDescription) {
                result.seoDescriptions.push(currentDescription.trim());
              }
              currentDescription = "";
              isCollectingDescription = true;
            } else if (isCollectingDescription && !cleanSection.includes("SEO Descriptions")) {
              if (currentDescription) {
                currentDescription += "\n\n";
              }
              currentDescription += cleanSection;
            }
            break;
            
          case "meta":
            if (!cleanSection.includes("Meta Description")) {
              const meta = cleanSection.replace(/^"|"$/g, '').trim();
              if (meta) {
                result.metaDescription = meta;
              }
            }
            break;
        }
      }
    });

    // Add the last description if there is one
    if (currentDescription) {
      result.seoDescriptions.push(currentDescription.trim());
    }

    console.log("Final parsed result:", result);
  } catch (error) {
    console.error("Error parsing product description:", error);
  }

  return result;
}