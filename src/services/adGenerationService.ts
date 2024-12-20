import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface GenerateAdParams {
  brandBible: string;
  platform: string;
  adType: string;
  productUrl?: string;
  productTitle?: string;
  productDescription?: string;
}

interface GeneratedContent {
  primaryTexts: string[];
  headlines: string[];
  descriptions: string[];
}

interface GenerateAdResponse {
  content: GeneratedContent;
}

export async function generateAd(params: GenerateAdParams): Promise<GenerateAdResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-ad', {
      body: params,
    });

    if (error) {
      console.error('Error generating ad:', error);
      throw new Error(error.message);
    }

    return data;
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