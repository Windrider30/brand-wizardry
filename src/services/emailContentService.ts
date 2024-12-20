import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface GenerateEmailContentParams {
  brandBible: string;
  contentType: string;
  productUrl?: string;
  title?: string;
  description?: string;
}

export async function generateEmailContent({
  brandBible,
  contentType,
  productUrl,
  title,
  description,
}: GenerateEmailContentParams): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-email-content', {
      body: {
        brandBible,
        contentType,
        productUrl,
        title,
        description,
      },
    });

    if (error) {
      console.error('Error generating email content:', error);
      throw new Error(error.message);
    }

    return data.content;
  } catch (error) {
    console.error('Error in generateEmailContent:', error);
    toast({
      title: "Error",
      description: "Failed to generate email content. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
}