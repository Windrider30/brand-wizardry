export function cleanResponse(text: string) {
  // Remove all emojis and markdown headers
  text = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
  text = text.replace(/#{1,6}\s/g, '');
  
  // Replace "Basic Brand Bible" with "Brand Bible" at the start of the text
  text = text.replace(/^Basic Brand Bible/gim, 'Brand Bible');
  text = text.replace(/Basic Brand Bible for/gi, 'Brand Bible for');
  
  // Remove all introductory phrases
  text = text.replace(/Hello!.*?(?=Brand Bible)/s, '');
  text = text.replace(/Thank you for sharing.*?(?=\n)/s, '');
  text = text.replace(/Well, roll up your sleeves.*?(?=\n)/s, '');
  text = text.replace(/Certainly!.*?(?=\n)/s, '');
  text = text.replace(/Now, dear student.*?(?=\n)/s, '');
  text = text.replace(/Absolutely!.*?(?=\n)/s, '');
  
  // Remove all conclusion-style endings from each section
  text = text.replace(/Next steps could include.*?(?=\n|$)/gs, '');
  text = text.replace(/By understanding these personas.*?(?=\n|$)/gs, '');
  text = text.replace(/Remember, thorough customer.*?(?=\n|$)/gs, '');
  text = text.replace(/Conclusion:?.*?(?=\n|$)/gs, '');
  text = text.replace(/In conclusion:?.*?(?=\n|$)/gs, '');
  text = text.replace(/To maximize engagement.*?(?=\n|$)/gs, '');
  
  // Remove any lines starting with common chatbot phrases
  text = text.replace(/^(Now|Well|Alright|Here's|Based on|Let's|Absolutely).*?\n/gm, '');
  
  // Remove quotes with attribution and emoji-wrapped text
  text = text.replace(/["'].*?- [A-Za-z]+["']/g, '');
  text = text.replace(/🔍.*?🔍/gs, '');
  
  // Clean up extra newlines and spaces
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();
  
  return text;
}