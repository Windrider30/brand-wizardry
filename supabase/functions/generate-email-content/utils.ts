export function cleanupResponse(content: string): string {
  // Remove Mercury's introductory text
  content = content.replace(/^Absolutely!.*?testing\.\s*📧\s*/s, '');
  
  // Remove Mercury's closing text
  content = content.replace(/Feel free to modify.*?📧\s*$/s, '');
  
  // Remove any remaining emojis
  content = content.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
  
  // Trim any extra whitespace
  return content.trim();
}

export function createPrompt(brandBible: string, contentType: string, productInfo: string): string {
  return `Mercury this is my brand bible:\n${brandBible}\n\nUsing my brand voice and the vibe of my brand I need you to write a marketing email for the following ${contentType}:\n${productInfo}\n\nPlease make sure to hit all of my target market's pain points when writing the email, and phrase it so that the ${contentType} is both the solution as well as a reward itself!`;
}