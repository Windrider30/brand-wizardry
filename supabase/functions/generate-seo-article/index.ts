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

    const prompt = `Generate an SEO-optimized article based on the following information:
      ${title ? `Title: ${title}` : 'Please generate an engaging title'}
      ${keywords.length > 0 ? `Keywords to include: ${keywords.join(', ')}` : 'Please optimize for relevant keywords'}
      Product URLs to reference: ${productUrls.join(', ')}
      Image URLs to include: ${imageUrls.join(', ')}

      Brand Voice Context:
      ${brandBible}

      Instructions:
      1. Create a well-structured article that naturally incorporates the products and images
      2. Use SEO best practices for headings and content structure
      3. Maintain the brand voice throughout
      4. Include relevant keywords naturally
      5. Format the output in HTML for proper rendering

      Please generate a comprehensive article that follows these guidelines.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert SEO content writer who creates engaging, well-structured articles that incorporate products and images naturally while maintaining brand voice and SEO best practices."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      }),
    });

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-seo-article function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});