interface ParsedContent {
  type: 'image' | 'product-link' | 'markdown-link' | 'h1' | 'h2' | 'h3' | 'paragraph';
  content: string;
  url?: string;
  linkText?: string;
}

export function parseContent(content: string): ParsedContent[] {
  const lines = content.split('\n');
  return lines.map((line) => {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) return null;

    // Handle image URLs
    if (trimmedLine.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)/i)) {
      return {
        type: 'image',
        content: trimmedLine
      };
    }
    
    // Handle product URLs (both plain URLs and markdown format)
    const markdownLinkMatch = trimmedLine.match(/\[(.*?)\]\((.*?)\)/);
    if (markdownLinkMatch) {
      const [_, linkText, url] = markdownLinkMatch;
      if (url.includes('/products/')) {
        return {
          type: 'product-link',
          content: url,
          linkText: linkText
        };
      }
      return {
        type: 'markdown-link',
        content: trimmedLine,
        linkText: linkText,
        url: url
      };
    }
    
    if (trimmedLine.match(/^https?:\/\/.*\/products\//)) {
      return {
        type: 'product-link',
        content: trimmedLine
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