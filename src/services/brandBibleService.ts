import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export async function generateBrandBible(brandInfo: {
  name: string;
  product: string;
  vibe: string;
  brandStyle: string;
}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No session found. Please log in.');
    }
    
    const response = await supabase.functions.invoke('openai', {
      body: {
        messages: [{
          role: "user",
          content: `I need a brand bible for the following brand:
            Brand Name: ${brandInfo.name}
            Product/Service: ${brandInfo.product}
            Desired Vibe: ${brandInfo.vibe}
            Brand Style: ${brandInfo.brandStyle}
            
            Please provide a comprehensive brand bible including:
            - Tagline
            - Mission Statement
            - Vision Statement
            - Core Values (at least 5)`
        }],
        persona: "dr_brand"
      }
    });

    if (response.error) {
      console.error("OpenAI API Error:", response.error);
      throw new Error(response.error.message || "Failed to generate content");
    }

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from OpenAI");
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating brand bible:", error);
    toast({
      title: "Error",
      description: "Failed to generate brand bible. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
}