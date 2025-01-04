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
  seoTitles: string[];
}

export async function generateProductDescription(productInfo: ProductInfo): Promise<ProductDescriptionResponse | null> {
  try {
    const response = await supabase.functions.invoke('openai', {
      body: {
        messages: [{
          role: "user",
          content: `Using this brand bible for tone and style:
            ${productInfo.brandBible}
            
            For this product:
            Product Name: ${productInfo.name}
            Key Features & Benefits: ${productInfo.features}
            
            Please provide:
            1. SEO Title Options (3 versions, each between 60-75 characters, compelling and optimized for search)
            
            2. Marketing Hooks (3 unique options that each use one pain point, following Style 2 where the product is both solution and reward)
            
            3. SEO Descriptions (3 unique versions)
            Requirements for each description:
            - Must be between 200-300 words
            - Must have exactly two paragraphs
            - Must use the brand's unique voice and tone
            - Must address ALL target market pain points subtly but impactfully
            - Must position the product as both the ONLY solution and a reward
            - Must NOT use the words "Functional," "Versatile," "Whimsical" or variations
            - Must incorporate emotional triggers
            - Must use persuasive language
            - Must include clear benefits and value propositions
            
            4. Meta Description (1 version, exactly 175 characters, using brand voice)
            
            Format your response with clear numbered sections and line breaks between sections.
            
            Remember:
            - The product should be presented as both the solution and a reward
            - Each description must be two paragraphs
            - Avoid the forbidden words completely
            - Use Style 2 consistently throughout`
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