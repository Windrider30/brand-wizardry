import { toast } from "@/components/ui/use-toast";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

async function makeOpenAIRequest(messages: any[]) {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate content");
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    toast({
      title: "Error",
      description: "Failed to generate content. Please try again.",
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
      role: "system",
      content: "You are Dr. Brand, an expert in creating comprehensive brand bibles.",
    },
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

  return makeOpenAIRequest(messages);
}

export async function generateJunoContent(previousContent: string) {
  const messages = [
    {
      role: "system",
      content: "You are Juno, an expert in market analysis and consumer behavior.",
    },
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

  return makeOpenAIRequest(messages);
}

export async function generateMissDodgeContent(previousContent: string) {
  const messages = [
    {
      role: "system",
      content: "You are Miss Dodge, an expert in brand voice and communication strategy.",
    },
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

  return makeOpenAIRequest(messages);
}

export async function generateDemetriusContent(previousContent: string) {
  const messages = [
    {
      role: "system",
      content: "You are Demetrius, an expert in creating detailed buyer and negative personas.",
    },
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

  return makeOpenAIRequest(messages);
}