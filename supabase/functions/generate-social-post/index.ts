import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const assistantId = 'asst_nMOJt6hCp2k7Uom02V9xrGPc';

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
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { brandBible, platform, productUrl, productTitle, productDescription } = await req.json();

    if (!brandBible || !platform) {
      throw new Error('Missing required fields');
    }

    console.log('Creating thread...');
    // Create a thread with proper error handling
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    if (!threadResponse.ok) {
      const errorText = await threadResponse.text();
      console.error('Thread creation failed:', errorText);
      throw new Error(`Failed to create thread: ${errorText}`);
    }
    
    const thread = await threadResponse.json();
    console.log('Thread created:', thread);

    // Create the message with proper content formatting
    let productInfo = productUrl ? 
      `Product URL: ${productUrl}` : 
      `Product Title: ${productTitle}\nProduct Description: ${productDescription}`;

    const messageContent = `Generate a social media post for ${platform}. Use my brand voice when writing the post, and include relevant hashtags. The post will be for the following product:\n\n${productInfo}\n\nHere is my brand bible for reference:\n${brandBible}`;

    console.log('Adding message to thread...');
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

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      console.error('Message creation failed:', errorText);
      throw new Error(`Failed to create message: ${errorText}`);
    }
    
    console.log('Message added to thread');

    // Run the assistant
    console.log('Running assistant...');
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

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error('Run creation failed:', errorText);
      throw new Error(`Failed to create run: ${errorText}`);
    }

    const run = await runResponse.json();
    console.log('Run created:', run);

    // Poll for completion with proper error handling
    let runStatus = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    if (!runStatus.ok) {
      const errorText = await runStatus.text();
      console.error('Run status check failed:', errorText);
      throw new Error(`Failed to check run status: ${errorText}`);
    }
    
    let runStatusData = await runStatus.json();
    console.log('Initial run status:', runStatusData.status);
    
    while (runStatusData.status !== 'completed' && runStatusData.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      if (!runStatus.ok) {
        const errorText = await runStatus.text();
        console.error('Run status check failed:', errorText);
        throw new Error(`Failed to check run status: ${errorText}`);
      }
      
      runStatusData = await runStatus.json();
      console.log('Current status:', runStatusData.status);
    }

    if (runStatusData.status === 'failed') {
      console.error('Run failed:', runStatusData.last_error);
      throw new Error('Assistant run failed: ' + JSON.stringify(runStatusData.last_error));
    }

    // Get the messages with proper error handling
    console.log('Retrieving messages...');
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });
    
    if (!messagesResponse.ok) {
      const errorText = await messagesResponse.text();
      console.error('Messages retrieval failed:', errorText);
      throw new Error(`Failed to retrieve messages: ${errorText}`);
    }

    const messages = await messagesResponse.json();
    const generatedContent = messages.data[0].content[0].text.value;
    console.log('Generated content:', generatedContent);

    return new Response(JSON.stringify({ content: generatedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-social-post function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});