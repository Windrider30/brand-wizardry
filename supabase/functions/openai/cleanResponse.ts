export function cleanResponse(text: string) {
  // Remove all emojis and markdown headers
  text = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
  text = text.replace(/#{1,6}\s/g, '');
  
  // Remove "Basic Brand Bible" completely from anywhere in the text
  text = text.replace(/Basic Brand Bible.*?\n/gi, '');
  text = text.replace(/Basic Brand Bible.*/gi, '');
  text = text.replace(/^Brand Bible.*?\n/gi, '');
  
  // Remove all introductory phrases and ChatGPT-style responses
  text = text.replace(/^(Hello|Hi|Hey|Absolutely|Sure|Great|Perfect|Here's|Let's|Now)!?\s.*?\n/gim, '');
  text = text.replace(/Thank you for sharing.*?(?=\n)/s, '');
  text = text.replace(/Well, roll up your sleeves.*?(?=\n)/s, '');
  text = text.replace(/Certainly!.*?(?=\n)/s, '');
  text = text.replace(/Now, dear student.*?(?=\n)/s, '');
  text = text.replace(/I'd be happy to.*?(?=\n)/s, '');
  text = text.replace(/Let me help you.*?(?=\n)/s, '');
  
  // Remove all conclusion-style endings from each section
  text = text.replace(/Next steps could include.*?(?=\n|$)/gs, '');
  text = text.replace(/By understanding these personas.*?(?=\n|$)/gs, '');
  text = text.replace(/Remember, thorough customer.*?(?=\n|$)/gs, '');
  text = text.replace(/Conclusion:?.*?(?=\n|$)/gs, '');
  text = text.replace(/In conclusion:?.*?(?=\n|$)/gs, '');
  text = text.replace(/To maximize engagement.*?(?=\n|$)/gs, '');
  text = text.replace(/Together, we craft insights.*?(?=\n|$)/gs, '');
  
  // Remove any lines starting with common chatbot phrases
  text = text.replace(/^(Now|Well|Alright|Here's|Based on|Let's|Absolutely).*?\n/gm, '');
  
  // Remove quotes with attribution and emoji-wrapped text
  text = text.replace(/["'].*?- [A-Za-z]+["']/g, '');
  text = text.replace(/🔍.*?🔍/gs, '');
  
  // Remove any signature-style endings
  text = text.replace(/[-—]\s*[A-Za-z]+\s*$/gm, '');
  text = text.replace(/Let['']s continue this enlightening journey!.*$/gm, '');
  
  // Clean up extra newlines and spaces
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();
  
  return text;
}