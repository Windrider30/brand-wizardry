import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

async function makeOpenAIRequest(messages: any[], persona: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No session found. Please log in.');
    }
    
    const response = await supabase.functions.invoke('openai', {
      body: {
        messages,
        persona
      }
    });

    if (response.error) {
      console.error("OpenAI API Error:", response.error);
      throw new Error(response.error.message || "Failed to generate content");
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    toast({
      title: "Error",
      description: "Failed to generate content. Please try again later.",
      variant: "destructive",
    });
    throw error;
  }
}

export async function generateDrBrandContent(brandInfo: {
  name: string;
  product: string;
  vibe: string;
  brandStyle: string;
}) {
  const messages = [
    {
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
        - Core Values (at least 5)`,
    },
  ];

  return makeOpenAIRequest(messages, "dr_brand");
}

export async function generateJunoContent(previousContent: string) {
  const messages = [
    {
      role: "user",
      content: `Please give me an in-depth target market analysis for the following brand:
        ${previousContent}
        
        Include:
        1. Detailed Demographics
        2. Psychographics
        3. Behavioral Insights
        4. At least 6 pain points (3 emotional, 3 practical)`,
    },
  ];

  return makeOpenAIRequest(messages, "juno");
}

export async function generateMissDodgeContent(previousContent: string) {
  const messages = [
    {
      role: "user",
      content: `I need a better brand voice than what is currently outlined in this brand bible:
        ${previousContent}
        
        Please provide:
        - Brand Voice Framework
        - Refined Tagline Options
        - Brand Voice Archetypes
        - Key Messaging Pillars
        - Tone in Action examples`,
    },
  ];

  return makeOpenAIRequest(messages, "miss_dodge");
}

export async function generateDemetriusContent(previousContent: string) {
  const messages = [
    {
      role: "user",
      content: `Please create buyer and negative personas for the following brand:
        ${previousContent}
        
        Include:
        - 2 detailed buyer personas
        - 2 detailed negative personas
        Each with demographics, psychographics, pain points, and buying behavior`,
    },
  ];

  return makeOpenAIRequest(messages, "demetrius");
}