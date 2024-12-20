import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseOpenAIResponse } from "@/utils/contentParser";

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
    
    const parsedContent = parseOpenAIResponse(content);
    
    return {
      marketingHooks: parsedContent.marketingHooks,
      seoDescriptions: parsedContent.seoDescriptions,
      metaDescription: parsedContent.metaDescription,
      newTitle: parsedContent.title
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