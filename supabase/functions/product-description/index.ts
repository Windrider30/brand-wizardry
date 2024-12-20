import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cleanResponse } from "../openai/cleanResponse.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, features, targetAudience } = await req.json();

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
            content: "You are a professional product copywriter who creates compelling, SEO-friendly product descriptions."
          },
          {
            role: "user",
            content: `Create a compelling product description for:
              Product Name: ${name}
              Key Features & Benefits: ${features}
              Target Audience: ${targetAudience}
              
              Please provide a well-structured description that highlights the benefits and appeals to the target audience.
              Include a compelling opening, feature highlights, and a strong call-to-action.`
          }
        ],
      }),
    });

    const data = await response.json();
    const description = cleanResponse(data.choices[0].message.content);

    return new Response(JSON.stringify(description), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in product-description function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});