const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
      content: content
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to add message: ${await response.text()}`);
  }
  
  return await response.json();
}

export async function runAssistant(threadId: string, assistantId: string) {
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

export async function checkRunStatus(threadId: string, runId: string) {
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

export async function waitForCompletion(threadId: string, runId: string) {
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