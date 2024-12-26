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
            4. Meta Description (1 version, max 155 characters)`
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