import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface GenerateAdParams {
  brandBible: string;
  platform: string;
  productUrl?: string;
  productTitle?: string;
  productDescription?: string;
}

export async function generateAd({
  brandBible,
  platform,
  productUrl,
  productTitle,
  productDescription,
}: GenerateAdParams): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-ad', {
      body: {
        brandBible,
        platform,
        productUrl,
        productTitle,
        productDescription,
      },
    });

    if (error) {
      console.error('Error generating ad:', error);
      throw new Error(error.message);
    }

    return data.content;
  } catch (error) {
    console.error('Error in generateAd:', error);
    toast({
      title: "Error",
      description: "Failed to generate ad content. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}