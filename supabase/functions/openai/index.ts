import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { ASSISTANT_IDS, corsHeaders } from "./constants.ts";
import { createThread, addMessage, runAssistant, waitForCompletion } from "./openaiService.ts";
import { cleanResponse } from "./cleanResponse.ts";

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
    
    // Clean and return the response
    const cleanedResponse = cleanResponse(response);

    return new Response(JSON.stringify({ 
      choices: [{ message: { content: cleanedResponse } }] 
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