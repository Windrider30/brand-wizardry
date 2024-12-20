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
        brandBible: productInfo.brandBible,
        name: productInfo.name,
        features: productInfo.features,
      }
    });

    if (response.error) {
      console.error("Error generating product description:", response.error);
      throw new Error(response.error.message);
    }

    const content = response.data.content;
    console.log("Raw content from OpenAI:", content);
    
    // Parse the response into structured sections
    const sections = content.split('\n\n').filter(Boolean);
    console.log("Parsed sections:", sections);
    
    // Extract the new title from the SEO Title section
    const titleSection = sections.find(s => s.toLowerCase().includes('seo title'));
    const newTitle = titleSection
      ?.split('\n')[1]  // Take the second line which should contain the first title
      ?.replace(/^\d+\.\s*["']|["']$/g, '')  // Remove number prefix and quotes
      ?.trim() || '';
    console.log("Extracted title:", newTitle);

    // Extract marketing hooks
    const hooksSection = sections.find(s => s.toLowerCase().includes('marketing hooks'));
    const marketingHooks = hooksSection
      ?.split('\n')
      .filter(line => line.startsWith('-') || line.match(/^\d+\./))
      .map(hook => hook.replace(/^[-\d.\s]+/, '').trim())
      .map(hook => hook.replace(/\*\*|\*/g, '')) || [];
    console.log("Extracted hooks:", marketingHooks);

    // Extract SEO descriptions
    const descriptionSection = sections.find(s => s.toLowerCase().includes('description option 1'));
    const seoDescriptions = sections
      .filter(section => 
        section.toLowerCase().includes('description option') && 
        !section.toLowerCase().includes('meta description')
      )
      .map(section => {
        // Remove the header and clean up the text
        const lines = section.split('\n').slice(1);
        return lines.join(' ')
          .replace(/\*\*|\*/g, '')
          .trim();
      })
      .filter(Boolean);
    console.log("Extracted SEO descriptions:", seoDescriptions);

    // Extract meta description
    const metaSection = sections.find(s => s.toLowerCase().includes('meta description'));
    const metaDescription = metaSection
      ?.split('\n')
      .find(line => line.match(/^\d+\.\s*["']/))
      ?.replace(/^\d+\.\s*["']|["']$/g, '')
      ?.trim() || '';
    console.log("Extracted meta description:", metaDescription);

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