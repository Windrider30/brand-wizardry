import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const mercuryAssistantId = 'asst_zahykeJVxsltO7TPB8AYVyCP';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function cleanupResponse(content: string): string {
  // Remove Mercury's introductory text
  content = content.replace(/^Absolutely!.*?testing\.\s*📧\s*/s, '');
  
  // Remove Mercury's closing text
  content = content.replace(/Feel free to modify.*?📧\s*$/s, '');
  
  // Trim any extra whitespace
  return content.trim();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brandBible, contentType, productUrl, title, description } = await req.json();

    // Create a thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    if (!threadResponse.ok) {
      throw new Error(`Failed to create thread: ${await threadResponse.text()}`);
    }

    const thread = await threadResponse.json();
    console.log('Thread created:', thread);

    // Create the prompt based on provided information
    let productInfo = productUrl 
      ? `URL: ${productUrl}`
      : `Title: ${title}\nDescription: ${description}`;

    // Add message to thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: `Mercury this is my brand bible:\n${brandBible}\n\nUsing my brand voice and the vibe of my brand I need you to write a marketing email for the following ${contentType}:\n${productInfo}\n\nPlease make sure to hit all of my target market's pain points when writing the email, and phrase it so that the ${contentType} is both the solution as well as a reward itself!`
      })
    });

    if (!messageResponse.ok) {
      throw new Error(`Failed to add message: ${await messageResponse.text()}`);
    }

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
        assistant_id: mercuryAssistantId
      })
    });

    if (!runResponse.ok) {
      throw new Error(`Failed to run assistant: ${await runResponse.text()}`);
    }

    const run = await runResponse.json();
    console.log('Assistant run started:', run);

    // Poll for completion
    let runStatus = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    let runStatusData = await runStatus.json();
    console.log('Initial run status:', runStatusData.status);

    // Poll until completion or failure
    while (runStatusData.status === 'in_progress' || runStatusData.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      runStatusData = await runStatus.json();
      console.log('Updated run status:', runStatusData.status);
    }

    if (runStatusData.status === 'completed') {
      // Get the messages
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      if (!messagesResponse.ok) {
        throw new Error(`Failed to get messages: ${await messagesResponse.text()}`);
      }

      const messages = await messagesResponse.json();
      const rawContent = messages.data[0].content[0].text.value;
      const cleanedContent = cleanupResponse(rawContent);

      return new Response(JSON.stringify({ content: cleanedContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error(`Assistant run failed: ${JSON.stringify(runStatusData.last_error)}`);
    }
  } catch (error) {
    console.error('Error in generate-email-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});