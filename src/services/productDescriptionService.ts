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
    
    // Extract the new title
    const newTitle = sections
      .find(s => s.toLowerCase().includes('title:'))
      ?.split('\n')[0]
      ?.replace(/^title:\s*/i, '')
      ?.trim() || '';

    const marketingHooks = sections
      .find(s => s.toLowerCase().includes('marketing hooks'))
      ?.split('\n')
      .filter(line => line.startsWith('-') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.'))
      .map(hook => hook.replace(/^[-\d.\s]+/, '').trim())
      .map(hook => hook.replace(/\*\*/g, '')) || [];

    const seoDescriptions = sections
      .filter(s => s.toLowerCase().includes('seo description'))
      .map(desc => {
        const lines = desc.split('\n').slice(1);
        return lines.join('\n').trim().replace(/\*\*/g, '');
      });

    const metaDescription = sections
      .find(s => s.toLowerCase().includes('meta description'))
      ?.split('\n')
      .slice(1)
      .join(' ')
      .trim()
      .replace(/\*\*/g, '') || '';

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