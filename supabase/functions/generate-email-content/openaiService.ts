const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const mercuryAssistantId = 'asst_zahykeJVxsltO7TPB8AYVyCP';

export async function createThread() {
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

export async function addMessage(threadId: string, content: string) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({
      role: 'user',
      content
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to add message: ${await response.text()}`);
  }

  return await response.json();
}

export async function runAssistant(threadId: string) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
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

  if (!response.ok) {
    throw new Error(`Failed to run assistant: ${await response.text()}`);
  }

  return await response.json();
}

export async function getRunStatus(threadId: string, runId: string) {
  const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'OpenAI-Beta': 'assistants=v2'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to get run status: ${await response.text()}`);
  }

  return await response.json();
}

export async function getMessages(threadId: string) {
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