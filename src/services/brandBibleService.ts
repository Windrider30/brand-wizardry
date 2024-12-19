import { toast } from "@/components/ui/use-toast";

interface BrandInfo {
  name: string;
  product: string;
  vibe: string;
  brandStyle: string;
}

const generateDrBrandPrompt = (info: BrandInfo) => {
  return `I need a brand bible for the following brand:
    Brand Name: ${info.name}
    Product/Service: ${info.product}
    Desired Vibe: ${info.vibe}
    Brand Style: ${info.brandStyle}
    
    Please provide a comprehensive brand bible including:
    - Tagline
    - Mission Statement
    - Vision Statement
    - Core Values (at least 5)`;
};

const generateJunoPrompt = (drBrandResponse: string) => {
  return `Please give me an in-depth target market analysis for the following brand:
    ${drBrandResponse}
    
    Include:
    1. Detailed Demographics
    2. Psychographics
    3. Behavioral Insights
    4. At least 6 pain points (3 emotional, 3 practical)`;
};

const generateMissDodgePrompt = (previousAnalysis: string) => {
  return `I need a better brand voice than what is currently outlined in this brand bible:
    ${previousAnalysis}
    
    Please provide:
    - Brand Voice Framework
    - Refined Tagline Options
    - Brand Voice Archetypes
    - Key Messaging Pillars
    - Tone in Action examples`;
};

const generateDemetriusPrompt = (fullBrandBible: string) => {
  return `Please create buyer and negative personas for the following brand:
    ${fullBrandBible}
    
    Include:
    - 2 detailed buyer personas
    - 2 detailed negative personas
    Each with demographics, psychographics, pain points, and buying behavior`;
};

export const generateBrandBible = async (brandInfo: BrandInfo) => {
  try {
    // Dr. Brand - Basic Brand Bible
    const drBrandResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: generateDrBrandPrompt(brandInfo),
          },
        ],
      }),
    });
    const drBrandData = await drBrandResponse.json();
    const basicBrandBible = drBrandData.choices[0].message.content;

    // Juno - Target Market Analysis
    const junoResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: generateJunoPrompt(basicBrandBible),
          },
        ],
      }),
    });
    const junoData = await junoResponse.json();
    const targetMarketAnalysis = junoData.choices[0].message.content;

    // Miss Dodge - Brand Voice
    const missDodgeResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: generateMissDodgePrompt(`${basicBrandBible}\n\n${targetMarketAnalysis}`),
          },
        ],
      }),
    });
    const missDodgeData = await missDodgeResponse.json();
    const brandVoice = missDodgeData.choices[0].message.content;

    // Demetrius - Personas
    const demetriusResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: generateDemetriusPrompt(
              `${basicBrandBible}\n\n${targetMarketAnalysis}\n\n${brandVoice}`
            ),
          },
        ],
      }),
    });
    const demetriusData = await demetriusResponse.json();
    const personas = demetriusData.choices[0].message.content;

    return {
      basicBrandBible,
      targetMarketAnalysis,
      brandVoice,
      personas,
    };
  } catch (error) {
    console.error("Error generating brand bible:", error);
    toast({
      title: "Error",
      description: "Failed to generate brand bible. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};