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

    // Create the image and product URLs section
    let imageAndProductUrlsSection = '';
    const maxUrls = Math.max(imageUrls.length, productUrls.length);
    for (let i = 0; i < maxUrls; i++) {
      imageAndProductUrlsSection += `[${i + 1}] Image: ${imageUrls[i] || ''}\nProduct: ${productUrls[i] || ''}\n\n`;
    }

    const prompt = `You are tasked with creating a high-quality, SEO-optimized HTML article that will rank well on Google. This article should be informative, engaging, and aligned with the provided brand voice. Follow these instructions carefully to produce the desired content:

Brand Voice: Review the brand bible provided. This document contains crucial information about the brand's voice, style, and values. Refer to it throughout the writing process to ensure consistency with the brand identity.
<brand_bible>
${brandBible}
</brand_bible>

Article Structure and SEO Optimization:
a) Create a compelling title that includes the main keyword${title ? ` (use this title if provided: ${title})` : ''}${keywords.length > 0 ? ` and optimize for these keywords: ${keywords.join(', ')}` : ''}.
b) Write a meta description of about 150-160 characters that summarizes the article and entices readers to click.
c) Divide the content into logical sections with appropriate H2 and H3 headings.
d) Include the main keyword in the first paragraph and use related keywords throughout the article naturally.
e) Ensure proper keyword density without keyword stuffing.
f) Use bullet points or numbered lists where appropriate to improve readability.
g) Keep the title at no more than 70 characters in length.

Incorporating Images and Product Links:
a) Embed the images and link to product pages using the following information:
${imageAndProductUrlsSection}

b) Integrate these images throughout the article where they are most relevant.
c) Use the following format for embedding each image, which is compatible with Shopify:
<img src="[FULL_IMAGE_URL]" alt="[DESCRIPTIVE_ALT_TEXT]" style="width:100%">
IMPORTANT: Use straight double quotes (") instead of curly quotes. The correct format uses straight quotes like this: src="..." alt="..." style="..."
d) Replace [FULL_IMAGE_URL] with the complete URL of the image, and [DESCRIPTIVE_ALT_TEXT] with appropriate alt text.
e) Ensure even distribution of images throughout the article.
f) Provide a detailed description of each image's contents within the article text.
g) Use anchor text that is relevant and descriptive.
h) Aim for a mix of internal and external links to improve SEO value.

Writing Style and Content:
a) Adhere to the tone and style guidelines outlined in the brand bible.
b) Use the appropriate level of formality, humor, or technical language as specified.
c) Maintain consistency in voice throughout the article.
d) The article MUST be approximately 1,500 words long. This is a strict requirement - do not generate less content.
e) Provide in-depth, valuable information on the topic.
f) Include practical examples, case studies, or data points to support your arguments.
g) Address potential questions or concerns the reader might have about the topic.

Conclusion:
a) Summarize the key points of the article.
b) Include a call-to-action that aligns with the brand's goals.

Article Excerpt:
Write a 100-word excerpt that captures the essence of the article. This excerpt should be engaging and informative, encouraging readers to continue reading the full article.

Output Format:
Present your article as properly formatted HTML, including:
- A <title> tag with the SEO-optimized title
- A <meta name="description"> tag with the meta description
- Proper use of heading tags (h1, h2, h3, etc.)
- Paragraphs wrapped in <p> tags
- Images inserted using <img> tags with appropriate alt text
- Links using <a> tags with descriptive anchor text
- Use of <ul>, <ol>, and <li> tags for lists
- The 100-word excerpt in a <div> with a class="article-excerpt"

Remember to maintain the brand voice throughout, use the provided images effectively, and create content that is both informative and optimized for search engines. Use only straight quotes (") and not curly quotes anywhere in the HTML.`;

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
            content: "You are an expert SEO content writer who creates engaging, well-structured articles that incorporate products and images naturally while maintaining brand voice and SEO best practices. You MUST generate articles that are approximately 1,500 words long."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000, // Increased to ensure we can get 1,500 words
      }),
    });

    const data = await response.json();
    console.log('OpenAI Response:', data);
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${JSON.stringify(data)}`);
    }
    
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