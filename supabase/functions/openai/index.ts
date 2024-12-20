import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./constants.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brandBible, name, features } = await req.json();

    const prompt = `Solaire, please give me the following for this product. Each element must be unique, so double check your work to avoid repetition:

Product Title: ${name}
Product Information: ${features}

Brand Bible Context:
${brandBible}

Please provide:
1. SEO Marketing Hooks (three unique options using emotional pain points)
2. SEO Descriptions (three unique options, 200-300 words each, two paragraphs per description)
3. Meta Description (max 160 characters)

Instructions:
- Use the brand voice from the provided brand bible
- Address target market pain points subtly, positioning the product as the solution
- Each SEO description must be two paragraphs and not exceed 300 words
- Avoid words: "Functional," "Versatile," "Whimsical"
- Meta description must align with the brand voice

Format the response in clear sections with headers.`;

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
            content: "You are Solaire, an expert in crafting compelling product descriptions and marketing content that resonates with target audiences."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      }),
    });

    const data = await response.json();
    
    return new Response(JSON.stringify({
      content: data.choices[0].message.content
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in Solaire function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});