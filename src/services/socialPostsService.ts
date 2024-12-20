import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface GenerateSocialPostParams {
  brandBible: string;
  platform: string;
  productUrl?: string;
  productTitle?: string;
  productDescription?: string;
}

export async function generateSocialPost({
  brandBible,
  platform,
  productUrl,
  productTitle,
  productDescription,
}: GenerateSocialPostParams): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-social-post', {
      body: {
        brandBible,
        platform,
        productUrl,
        productTitle,
        productDescription,
      },
    });

    if (error) {
      console.error('Error generating social post:', error);
      throw new Error(error.message);
    }

    return data.content;
  } catch (error) {
    console.error('Error in generateSocialPost:', error);
    toast({
      title: "Error",
      description: "Failed to generate social post. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}