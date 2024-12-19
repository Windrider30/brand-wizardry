import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const ASSISTANT_IDS = {
  dr_brand: "asst_PfKaHltgJciojiqAunmI7xF6",
  juno: "asst_dY7WP1Ik9aYwX2hvZeDPTMJR",
  miss_dodge: "asst_zymFL4PRjWXo3TYddMqf79iO",
  demetrius: "asst_k2V2izOTUTmaqe7focZXC1ci"
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function createThread() {
  const response = await fetch('https://api.openai.com/v1/threads', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v1'
    }
  });
  return await response.json();
}

async function addMessage(threadId: string, content: string) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v1'
    },
    body: JSON.stringify({
      role: 'user',
      content: content
    })
  });
  return await response.json();
}

async function runAssistant(threadId: string, assistantId: string) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v1'
    },
    body: JSON.stringify({
      assistant_id: assistantId
    })
  });
  return await response.json();
}

async function checkRunStatus(threadId: string, runId: string) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'OpenAI-Beta': 'assistants=v1'
    }
  });
  return await response.json();
}

async function getMessages(threadId: string) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'OpenAI-Beta': 'assistants=v1'
    }
  });
  return await response.json();
}

async function waitForCompletion(threadId: string, runId: string) {
  let status = await checkRunStatus(threadId, runId);
  
  while (status.status !== 'completed' && status.status !== 'failed') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    status = await checkRunStatus(threadId, runId);
    console.log('Current status:', status.status);
  }
  
  if (status.status === 'failed') {
    throw new Error('Assistant run failed: ' + JSON.stringify(status.last_error));
  }
  
  const messages = await getMessages(threadId);
  return messages.data[0].content[0].text.value;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, persona } = await req.json();
    console.log(`Processing request for persona: ${persona}`);
    
    const assistantId = ASSISTANT_IDS[persona];
    if (!assistantId) {
      throw new Error(`Invalid persona: ${persona}`);
    }

    // Create a new thread
    const thread = await createThread();
    console.log('Thread created:', thread.id);

    // Add the message to the thread
    const message = await addMessage(thread.id, messages[messages.length - 1].content);
    console.log('Message added:', message.id);

    // Run the assistant
    const run = await runAssistant(thread.id, assistantId);
    console.log('Run started:', run.id);

    // Wait for completion and get the response
    const response = await waitForCompletion(thread.id, run.id);
    console.log('Got response:', response);

    return new Response(JSON.stringify({ 
      choices: [{ message: { content: response } }] 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in OpenAI function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});