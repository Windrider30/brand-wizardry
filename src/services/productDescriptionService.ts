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
    
    // Parse the response into structured sections
    const sections = content.split('\n\n').filter(Boolean);
    
    const marketingHooks = sections
      .find(s => s.includes('Marketing Hooks') || s.includes('SEO Marketing Hooks'))
      ?.split('\n')
      .filter(line => line.startsWith('-') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.'))
      .map(hook => hook.replace(/^[-\d.\s]+/, '').trim()) || [];

    const seoDescriptions = sections
      .filter(s => s.includes('SEO Description'))
      .map(desc => desc.split('\n').slice(1).join('\n').trim());

    const metaDescription = sections
      .find(s => s.includes('Meta Description'))
      ?.split('\n')
      .slice(1)
      .join(' ')
      .trim() || '';

    // Extract the new title
    const newTitle = sections
      .find(s => s.includes('New Title:'))
      ?.split('\n')
      .slice(1)
      .join(' ')
      .trim() || '';

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