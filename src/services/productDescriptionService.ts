import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductInfo {
  name: string;
  features: string;
  targetAudience: string;
}

export async function generateProductDescription(productInfo: ProductInfo) {
  try {
    const response = await supabase.functions.invoke('product-description', {
      body: productInfo
    });

    if (response.error) {
      console.error("Product Description Generation Error:", response.error);
      throw new Error(response.error.message || "Failed to generate description");
    }

    return response.data;
  } catch (error) {
    console.error("Product Description Generation Error:", error);
    toast({
      title: "Error",
      description: "Failed to generate product description. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
}