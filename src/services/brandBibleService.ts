import { toast } from "@/components/ui/use-toast";
import {
  generateDrBrandContent,
  generateJunoContent,
  generateMissDodgeContent,
  generateDemetriusContent,
} from "./openaiService";

interface BrandInfo {
  name: string;
  product: string;
  vibe: string;
  brandStyle: string;
}

export async function generateBrandBible(brandInfo: BrandInfo) {
  try {
    // Step 1: Generate basic brand bible with Dr. Brand
    const basicBrandBible = await generateDrBrandContent(brandInfo);

    // Step 2: Generate target market analysis with Juno
    const targetMarketAnalysis = await generateJunoContent(basicBrandBible);

    // Step 3: Generate brand voice with Miss Dodge
    const brandVoice = await generateMissDodgeContent(
      `${basicBrandBible}\n\n${targetMarketAnalysis}`
    );

    // Step 4: Generate personas with Demetrius
    const personas = await generateDemetriusContent(
      `${basicBrandBible}\n\n${targetMarketAnalysis}\n\n${brandVoice}`
    );

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
}