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
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'Failed to generate SEO article');
    }

    if (!data) {
      throw new Error('No response received from the server');
    }

    if (!data.content) {
      throw new Error('No content was generated in the response');
    }

    return data;
  } catch (error) {
    console.error('Error in generateSeoArticle:', error);
    throw error instanceof Error ? error : new Error('An unexpected error occurred');
  }
}