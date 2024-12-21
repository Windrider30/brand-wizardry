import { supabase } from "@/integrations/supabase/client";

interface GenerateSeoArticleParams {
  brandBible: string;
  title?: string;
  keywords: string[];
  productUrls: string[];
  imageUrls: string[];
}

interface GenerateSeoArticleResponse {
  content: string;
}

export async function generateSeoArticle(params: GenerateSeoArticleParams): Promise<GenerateSeoArticleResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-seo-article', {
      body: params,
    });

    if (error) {
      console.error('Error generating SEO article:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in generateSeoArticle:', error);
    throw error;
  }
}