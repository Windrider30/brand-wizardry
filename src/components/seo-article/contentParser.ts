interface ParsedContent {
  type: 'image' | 'product-link' | 'markdown-link' | 'h1' | 'h2' | 'h3' | 'paragraph';
  content: string;
  url?: string;
  linkText?: string;
}

export function parseContent(content: string): ParsedContent[] {
  const lines = content.split('\n');
  return lines.map((line, index) => {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) return null;

    // Handle image URLs
    if (trimmedLine.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)/i)) {
      return {
        type: 'image',
        content: trimmedLine
      };
    }
    
    // Handle product URLs
    if (trimmedLine.match(/^https?:\/\/.*\/products\//)) {
      return {
        type: 'product-link',
        content: trimmedLine
      };
    }
    
    // Handle markdown links [text](url)
    const linkMatch = trimmedLine.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      return {
        type: 'markdown-link',
        content: trimmedLine,
        linkText: linkMatch[1],
        url: linkMatch[2]
      };
    }
    
    // Handle headers
    if (trimmedLine.startsWith('# ')) {
      return {
        type: 'h1',
        content: trimmedLine.replace('# ', '')
      };
    }
    
    if (trimmedLine.startsWith('## ')) {
      return {
        type: 'h2',
        content: trimmedLine.replace('## ', '')
      };
    }
    
    if (trimmedLine.startsWith('### ')) {
      return {
        type: 'h3',
        content: trimmedLine.replace('### ', '')
      };
    }
    
    // Handle regular paragraphs
    return {
      type: 'paragraph',
      content: trimmedLine
    };
  }).filter(Boolean) as ParsedContent[];
}