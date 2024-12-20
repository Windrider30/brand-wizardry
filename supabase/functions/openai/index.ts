import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./constants.ts";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brandBible, name, features } = await req.json();

    const prompt = `Solaire, please give me the following, each thing must be unique so double check your work before replying to make sure you do not get stuck in a loop as each picture will have the same title with the exception of a number at the end of the title:

Title: ${name}
SEO Marketing Hooks Make sure to use one of the emotional pain points in the marking hook (Three unique options)
SEO Descriptions Three unique options, each unique and be between 200 to 300 words and have two paragraphs make sure to use ONLY the title: ${name}
Meta Description: Must be no longer than 160 characters in length
Product Title: ${name}
Product Information: ${features}

Brand Bible Context:
${brandBible}

Instructions:
- Use the brand voice from the provided brand bible
- Pain Points: Address all five target market pain points with impact but subtly. The product should be the only solution and feel like a reward.
- SEO Description: Each description must be at least two paragraphs long and should not exceed 300 words.
- Avoid Words: Avoid using "Functional," "Versatile," "Whimsical," or any variations of these terms.
- Meta Description: Create a meta description no more than 175 characters long, aligning with the brand voice.

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