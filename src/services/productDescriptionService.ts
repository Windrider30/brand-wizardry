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
    console.log("Raw content from OpenAI:", content); // Debug log
    
    // Parse the response into structured sections
    const sections = content.split('\n\n').filter(Boolean);
    console.log("Parsed sections:", sections); // Debug log
    
    // Extract the new title
    const titleSection = sections.find(s => s.toLowerCase().includes('title:'));
    const newTitle = titleSection
      ?.split('\n')[0]
      ?.replace(/^title:\s*/i, '')
      ?.trim() || '';
    console.log("Extracted title:", newTitle); // Debug log

    // Extract marketing hooks
    const hooksSection = sections.find(s => s.toLowerCase().includes('marketing hooks'));
    const marketingHooks = hooksSection
      ?.split('\n')
      .filter(line => line.startsWith('-') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.'))
      .map(hook => hook.replace(/^[-\d.\s]+/, '').trim())
      .map(hook => hook.replace(/\*\*/g, '')) || [];
    console.log("Extracted hooks:", marketingHooks); // Debug log

    // Extract SEO descriptions
    const seoDescriptions = sections
      .filter(s => s.toLowerCase().includes('seo description'))
      .map(desc => {
        const lines = desc.split('\n').slice(1);
        return lines.join(' ').trim().replace(/\*\*/g, '');
      })
      .filter(Boolean);
    console.log("Extracted SEO descriptions:", seoDescriptions); // Debug log

    // Extract meta description
    const metaSection = sections.find(s => s.toLowerCase().includes('meta description'));
    const metaDescription = metaSection
      ?.split('\n')
      .slice(1)
      .join(' ')
      .trim()
      .replace(/\*\*/g, '') || '';
    console.log("Extracted meta description:", metaDescription); // Debug log

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