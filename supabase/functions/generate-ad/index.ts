import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const assistantId = 'asst_w9CrBiMAhEedNm7xwqUS1QN0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brandBible, platform, adType, productUrl, productTitle, productDescription } = await req.json();

    // Create a thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    const thread = await threadResponse.json();
    console.log('Thread created:', thread);

    // Create the message
    let productInfo = productUrl ? 
      `Product URL: ${productUrl}` : 
      `Product Title: ${productTitle}\nProduct Description: ${productDescription}`;

    const messageContent = `AdSavant i need a ${platform} ad (${adType}) for the following product: ${productInfo}

Please make sure to use my brand voice and keep the vibe of my brand when making the ad. Here is my brand bible for reference:
${brandBible}

Please provide:
1. Five primary text options (max 125 characters each) designed to engage and compel
2. Five headlines (max 225 characters each) focused on capturing interest quickly
3. Five ad descriptions that:
   - Follow marketing best practices
   - Address at least two target market pain points (one emotional, one practical)

Please format the response in JSON with the following structure:
{
  "primaryTexts": ["text1", "text2", "text3", "text4", "text5"],
  "headlines": ["headline1", "headline2", "headline3", "headline4", "headline5"],
  "descriptions": ["desc1", "desc2", "desc3", "desc4", "desc5"]
}`;

    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: messageContent
      })
    });
    
    console.log('Message added to thread');

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });

    const run = await runResponse.json();
    console.log('Run created:', run);

    // Poll for completion
    let runStatus = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    let runStatusData = await runStatus.json();
    
    while (runStatusData.status !== 'completed' && runStatusData.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      runStatusData = await runStatus.json();
      console.log('Current status:', runStatusData.status);
    }

    if (runStatusData.status === 'failed') {
      throw new Error('Assistant run failed: ' + JSON.stringify(runStatusData.last_error));
    }

    // Get the messages
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    const messages = await messagesResponse.json();
    const generatedContent = messages.data[0].content[0].text.value;

    // Parse the JSON response
    const parsedContent = JSON.parse(generatedContent);

    return new Response(JSON.stringify({ content: parsedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ad function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});