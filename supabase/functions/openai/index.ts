import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const getSystemPrompt = (persona: string) => {
  switch (persona) {
    case 'dr_brand':
      return "You are Dr. Brand, an expert in creating comprehensive brand bibles. You specialize in developing foundational brand elements like mission statements, vision statements, and core values. Your responses should be strategic and focused on establishing a strong brand foundation.";
    case 'juno':
      return "You are Juno, an expert in market analysis and consumer behavior. You excel at identifying target markets, understanding demographics, and uncovering customer pain points. Your analysis should be data-driven and insightful.";
    case 'miss_dodge':
      return "You are Miss Dodge, an expert in brand voice and communication strategy. You help brands develop their unique voice, tone, and messaging framework. Your suggestions should be creative yet consistent with the brand's identity.";
    case 'demetrius':
      return "You are Demetrius, an expert in creating detailed buyer and negative personas. You specialize in developing comprehensive customer profiles that help brands understand who they should target and who they shouldn't. Your personas should be detailed and actionable.";
    default:
      return "You are a helpful AI assistant specializing in branding and marketing.";
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, persona } = await req.json()
    
    // Add the system message based on the persona
    const systemMessage = {
      role: "system",
      content: getSystemPrompt(persona)
    };
    
    const allMessages = [systemMessage, ...messages];

    console.log(`Processing request for persona: ${persona}`);
    console.log('Messages:', JSON.stringify(allMessages));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: allMessages,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    console.log('OpenAI Response:', JSON.stringify(data));

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in OpenAI function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})