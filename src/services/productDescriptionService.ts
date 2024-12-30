import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { parseProductDescription } from "@/utils/openAIResponseParser";

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
          content: `Create compelling product content using Style 2 for:
            Product Name: ${productInfo.name}
            Key Features & Benefits: ${productInfo.features}
            
            Using this brand bible for tone and style:
            ${productInfo.brandBible}
            
            Please provide:
            1. SEO Title Options (3 versions, each compelling and optimized for search)
            2. Marketing Hooks (5 compelling hooks, each 20-30 words that speak directly to pain points)
            3. SEO Descriptions (3 versions, each 150-300 words, incorporating brand voice, addressing target market pain points, and positioning the product as both solution and reward)
            4. Meta Description (1 version, exactly 155 characters, compelling and SEO-optimized)
            
            Ensure each SEO description:
            - Is between 150-300 words
            - Uses the brand's unique voice and tone
            - Addresses all target market pain points
            - Positions the product as both a solution and a reward
            - Incorporates emotional triggers
            - Uses persuasive language
            - Includes clear benefits and value propositions
            
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
    
    return parseProductDescription(content);
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