import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createThread, addMessage, runAssistant, getRunStatus, getMessages } from "./openaiService.ts";
import { cleanupResponse, createPrompt } from "./utils.ts";

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
    const { brandBible, contentType, productUrl, title, description } = await req.json();

    // Create product info string based on provided data
    const productInfo = productUrl 
      ? `URL: ${productUrl}`
      : `Title: ${title}\nDescription: ${description}`;

    // Create thread
    const thread = await createThread();
    console.log('Thread created:', thread);

    // Add message to thread
    const prompt = createPrompt(brandBible, contentType, productInfo);
    await addMessage(thread.id, prompt);
    console.log('Message added to thread');

    // Run the assistant
    const run = await runAssistant(thread.id);
    console.log('Assistant run started:', run);

    // Poll for completion
    let runStatus = await getRunStatus(thread.id, run.id);
    console.log('Initial run status:', runStatus.status);

    // Poll until completion or failure
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await getRunStatus(thread.id, run.id);
      console.log('Updated run status:', runStatus.status);
    }

    if (runStatus.status === 'completed') {
      const messages = await getMessages(thread.id);
      const rawContent = messages.data[0].content[0].text.value;
      const cleanedContent = cleanupResponse(rawContent);

      return new Response(JSON.stringify({ content: cleanedContent }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error(`Assistant run failed: ${JSON.stringify(runStatus.last_error)}`);
    }
  } catch (error) {
    console.error('Error in generate-email-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});