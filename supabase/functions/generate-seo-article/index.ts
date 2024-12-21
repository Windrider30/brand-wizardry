import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brandBible, title, keywords, productUrls, imageUrls } = await req.json();
    console.log('Received request with:', { brandBible, title, keywords, productUrls, imageUrls });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Create the URLs section with plain text URLs
    let urlsSection = '';
    if (productUrls?.length > 0) {
      urlsSection += '\nProduct URLs:\n';
      productUrls.forEach((url: string) => {
        urlsSection += `${url}\n`;
      });
    }
    if (imageUrls?.length > 0) {
      urlsSection += '\nImage URLs:\n';
      imageUrls.forEach((url: string) => {
        urlsSection += `${url}\n`;
      });
    }

    const prompt = `You are tasked with creating a high-quality, SEO-optimized article. The article should be informative, engaging, and aligned with the provided brand voice. When referencing products, use the EXACT URLs provided - do not modify them or add any tracking parameters.

Brand Voice Guidelines:
${brandBible}

Article Requirements:
- Title: ${title || 'Generate an SEO-optimized title'}
- Keywords: ${keywords?.join(', ') || 'Generate relevant keywords'}

Referenced URLs:
${urlsSection}

Important Instructions:
1. Write an engaging, SEO-optimized article of approximately 1,500 words
2. When mentioning products, use the EXACT URLs provided - do not add any UTM parameters or modify the URLs in any way
3. Structure the content with clear headings and paragraphs
4. Naturally incorporate the keywords throughout the text
5. Make the content informative and valuable to readers
6. Include the exact product URLs as provided without any modifications
7. At the end of the article, provide:
   - A meta description (maximum 160 characters) that compellingly summarizes the article for search engines
   - A 100-word excerpt that captures the essence of the article for preview purposes

Return the article in plain text format, using standard markdown-style formatting for headings (# for h1, ## for h2, etc). Place the meta description and excerpt at the end of the article under their respective headers:

Meta Description:
[Your 160-character meta description here]

Excerpt:
[Your 100-word excerpt here]`;

    console.log('Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert SEO content writer. Generate articles in plain text format, using URLs exactly as provided without adding any tracking parameters."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Received response from OpenAI');
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('No content in OpenAI response:', data);
      throw new Error('OpenAI did not generate any content');
    }
    
    const generatedContent = data.choices[0].message.content;
    console.log('Generated content length:', generatedContent.length);
    
    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-seo-article function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      details: error instanceof Error ? error.stack : undefined
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});