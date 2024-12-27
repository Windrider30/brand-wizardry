import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductInfo {
  brandBible: string;
  name: string;
  features: string;
}

export interface ProductDescriptionResponse {
  marketingHooks: string[];
  seoDescriptions: string[];
  metaDescription: string;
  newTitle: string;
}

export async function generateProductDescription(productInfo: ProductInfo): Promise<ProductDescriptionResponse | null> {
  try {
    const response = await supabase.functions.invoke('openai', {
      body: {
        messages: [{
          role: "user",
          content: `Create product content for:
            Product Name: ${productInfo.name}
            Key Features & Benefits: ${productInfo.features}
            
            Using this brand bible for tone and style:
            ${productInfo.brandBible}
            
            Please provide:
            1. SEO Title Options (3 versions)
            2. Marketing Hooks (5 compelling hooks)
            3. SEO Descriptions (3 versions, each 150-160 characters)
            4. Meta Description (1 version, max 155 characters)
            
            Format your response with clear numbered sections and line breaks between sections.`
        }],
        persona: "product_copywriter"
      }
    });

    if (response.error) {
      console.error("Error generating product description:", response.error);
      throw new Error(response.error.message);
    }

    const content = response.data.choices[0].message.content;
    console.log("Raw content from OpenAI:", content);
    
    // Parse the sections
    const sections = content.split(/\d+\.\s+/).filter(Boolean);
    console.log("Parsed sections:", sections);
    
    // Extract title from the first section (SEO Title Options)
    const titles = sections[0].match(/\"([^"]+)\"/g) || [];
    const newTitle = titles[0]?.replace(/"/g, '') || '';

    // Extract marketing hooks from the second section
    const hooksSection = sections[1] || '';
    const marketingHooks = hooksSection.match(/\d+\.\s+"([^"]+)"/g)?.map(hook => {
      return hook.replace(/^\d+\.\s+"/, '').replace(/"$/, '');
    }) || [];

    // Extract SEO descriptions from the third section
    const descriptionsSection = sections[2] || '';
    const seoDescriptions = descriptionsSection.match(/\d+\.\s+"([^"]+)"/g)?.map(desc => {
      return desc.replace(/^\d+\.\s+"/, '').replace(/"$/, '');
    }) || [];

    // Extract meta description from the fourth section
    const metaDescription = (sections[3]?.match(/\"([^"]+)\"/) || [])[1] || '';

    return {
      marketingHooks,
      seoDescriptions,
      metaDescription,
      newTitle
    };
  } catch (error) {
    console.error("Error in generateProductDescription:", error);
    toast({
      title: "Error",
      description: "Failed to generate product description. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}