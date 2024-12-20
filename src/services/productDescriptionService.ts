import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductInfo {
  brandBible: string;
  name: string;
  features: string;
}

export async function generateProductDescription(productInfo: ProductInfo) {
  try {
    const response = await supabase.functions.invoke('openai', {
      body: {
        messages: [{
          role: "user",
          content: `Using this brand bible as context:
          ${productInfo.brandBible}
          
          Please write a product description for:
          Product Name: ${productInfo.name}
          Product Features: ${productInfo.features}
          
          The description should align with the brand voice and target audience defined in the brand bible.`
        }],
        persona: "solaire"
      }
    });

    if (response.error) {
      console.error("Error generating product description:", response.error);
      throw new Error(response.error.message);
    }

    return response.data.choices[0].message.content;
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