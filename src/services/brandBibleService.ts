import { supabase } from "@/integrations/supabase/client";

interface BrandInfo {
  name: string;
  product: string;
  vibe: string;
  brandStyle: string;
}

export async function generateBrandBible(brandInfo: BrandInfo): Promise<string> {
  try {
    const response = await supabase.functions.invoke('openai', {
      body: {
        messages: [{
          role: "user",
          content: `Create a brand bible for:
            Brand Name: ${brandInfo.name}
            Product/Service: ${brandInfo.product}
            Desired Vibe: ${brandInfo.vibe}
            Brand Style: ${brandInfo.brandStyle}
            
            Please provide:
            1. Brand Overview
            2. Tagline
            3. Mission Statement
            4. Vision Statement
            5. Core Values (at least 5)
            6. Target Market Analysis
            7. Brand Voice Guidelines
            8. Buyer Personas`
        }],
        persona: "dr_brand"
      }
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateBrandBible:', error);
    throw error;
  }
}