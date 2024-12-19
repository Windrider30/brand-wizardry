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

function cleanResponse(text: string) {
  // Remove all emojis and markdown headers
  text = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
  text = text.replace(/#{1,6}\s/g, '');
  
  // Replace "Basic Brand Bible" with "Brand Bible" (more aggressive)
  text = text.replace(/Basic Brand Bible/gi, 'Brand Bible');
  
  // Remove all introductory phrases
  text = text.replace(/Hello!.*?(?=Brand Bible)/s, '');
  text = text.replace(/Thank you for sharing.*?(?=\n)/s, '');
  text = text.replace(/Well, roll up your sleeves.*?(?=\n)/s, '');
  text = text.replace(/Certainly!.*?(?=\n)/s, '');
  text = text.replace(/Now, dear student.*?(?=\n)/s, '');
  
  // Remove all conclusion-style endings from each section
  text = text.replace(/Next steps could include.*?(?=\n|$)/gs, '');
  text = text.replace(/By understanding these personas.*?(?=\n|$)/gs, '');
  text = text.replace(/Remember, thorough customer.*?(?=\n|$)/gs, '');
  text = text.replace(/Conclusion:?.*?(?=\n|$)/gs, '');
  text = text.replace(/In conclusion:?.*?(?=\n|$)/gs, '');
  text = text.replace(/To maximize engagement.*?(?=\n|$)/gs, '');
  
  // Remove any lines starting with common chatbot phrases
  text = text.replace(/^(Now|Well|Alright|Here's|Based on|Let's).*?\n/gm, '');
  
  // Remove quotes with attribution
  text = text.replace(/["'].*?- [A-Za-z]+["']/g, '');
  text = text.replace(/🔍.*?🔍/gs, '');
  
  // Clean up extra newlines and spaces
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();
  
  return text;
}

async function createThread() {
  const response = await fetch('https://api.openai.com/v1/threads', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create thread: ${await response.text()}`);
  }
  
  return await response.json();
}

async function addMessage(threadId: string, content: string) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({
      role: 'user',
      content: content
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to add message: ${await response.text()}`);
  }
  
  return await response.json();
}

async function runAssistant(threadId: string, assistantId: string) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
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
  
  if (!response.ok) {
    throw new Error(`Failed to run assistant: ${await response.text()}`);
  }
  
  return await response.json();
}

async function checkRunStatus(threadId: string, runId: string) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'OpenAI-Beta': 'assistants=v2'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to check run status: ${await response.text()}`);
  }
  
  return await response.json();
}

async function getMessages(threadId: string) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'OpenAI-Beta': 'assistants=v2'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get messages: ${await response.text()}`);
  }
  
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
  const response = messages.data[0].content[0].text.value;
  return cleanResponse(response);
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