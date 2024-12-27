import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { cleanResponse } from "./cleanResponse.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, persona } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Invalid messages format');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Sending request to OpenAI with messages:', JSON.stringify(messages));

    // Enhance the system message based on persona
    let systemContent = `You are ${persona}, an AI assistant specialized in brand development and marketing content generation.`;
    
    if (persona === 'dr_brand') {
      systemContent += `
        When creating brand bibles, always include:
        1. Comprehensive Brand Overview
        2. Compelling Tagline Options (at least 3)
        3. Clear Mission Statement
        4. Forward-looking Vision Statement
        5. Detailed Core Values (minimum 5)
        6. In-depth Target Market Analysis including:
           - Detailed Demographics
           - Psychographics
           - Behavioral Patterns
           - Pain Points (3 emotional and 3 practical)
        7. Brand Voice Guidelines with specific examples
        8. Detailed Buyer Personas (minimum 2)
        
        Format your response in clear sections with proper spacing and headers.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemContent
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenAI response format:', data);
      throw new Error('Invalid response format from OpenAI');
    }

    const cleanedContent = cleanResponse(data.choices[0].message.content);

    return new Response(JSON.stringify({
      choices: [{ message: { content: cleanedContent } }]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in OpenAI function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred while processing your request'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});