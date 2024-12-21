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

    // Create the image and product URLs section
    let imageAndProductUrlsSection = '';
    const maxUrls = Math.max(imageUrls?.length || 0, productUrls?.length || 0);
    for (let i = 0; i < maxUrls; i++) {
      imageAndProductUrlsSection += `[${i + 1}] Image: ${imageUrls?.[i] || ''}\nProduct: ${productUrls?.[i] || ''}\n\n`;
    }

    const prompt = `You are tasked with creating a high-quality, SEO-optimized HTML article that will rank well on Google. This article should be informative, engaging, and aligned with the provided brand voice. Follow these instructions carefully to produce the desired content:

Brand Voice: Review the brand bible provided. This document contains crucial information about the brand's voice, style, and values. Refer to it throughout the writing process to ensure consistency with the brand identity.
<brand_bible>
${brandBible}
</brand_bible>

Article Structure and SEO Optimization:
a) Create a compelling title that includes the main keyword${title ? ` (use this title if provided: ${title})` : ''}${keywords?.length > 0 ? ` and optimize for these keywords: ${keywords.join(', ')}` : ''}.
b) Write a meta description of about 150-160 characters that summarizes the article and entices readers to click.
c) Divide the content into logical sections with appropriate H2 and H3 headings.
d) Include the main keyword in the first paragraph and use related keywords throughout the article naturally.
e) Ensure proper keyword density without keyword stuffing.
f) Use bullet points or numbered lists where appropriate to improve readability.
g) Keep the title at no more than 70 characters in length.

Incorporating Images and Product Links:
${imageAndProductUrlsSection}

Writing Style and Content:
a) Adhere to the tone and style guidelines outlined in the brand bible.
b) Use the appropriate level of formality, humor, or technical language as specified.
c) Maintain consistency in voice throughout the article.
d) The article MUST be approximately 1,500 words long.
e) Provide in-depth, valuable information on the topic.
f) Include practical examples, case studies, or data points to support your arguments.
g) Address potential questions or concerns the reader might have about the topic.

Format the article in HTML, using appropriate tags for headings, paragraphs, lists, and other elements.
Return ONLY the HTML content, no additional commentary or metadata.`;

    console.log('Sending request to OpenAI...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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
    console.log('Received response from OpenAI:', data);
    
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