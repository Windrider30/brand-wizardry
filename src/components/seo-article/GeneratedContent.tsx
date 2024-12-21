import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import DOMPurify from "dompurify";

interface GeneratedContentProps {
  content: string;
}

export function GeneratedContent({ content }: GeneratedContentProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Article copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Function to convert text content to HTML with clickable links and images
  const convertToHtml = (content: string) => {
    // Remove any existing HTML tags first
    let htmlContent = content.replace(/<[^>]*>/g, '');
    
    // First, handle image URLs and their corresponding product links
    const lines = htmlContent.split('\n');
    let processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const currentLine = lines[i];
      const nextLine = lines[i + 1];
      
      // Check if current line is an image URL and next line is a product URL
      if (
        currentLine.trim().match(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)/i) &&
        nextLine?.trim().match(/^https?:\/\/.*\/products\//)
      ) {
        // Create a product card with image and link
        processedLines.push(`
          <div class="product-card mb-6 rounded-lg overflow-hidden border border-gray-200">
            <img src="${currentLine.trim()}" alt="Product" class="w-full h-auto object-cover" />
            <div class="p-4">
              <a href="${nextLine.trim()}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline block">
                View Product
              </a>
            </div>
          </div>
        `);
        i++; // Skip the next line since we've processed it
      } else {
        // Handle regular URLs that aren't part of an image-product pair
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const processedLine = currentLine.replace(urlRegex, (url) => {
          if (url.match(/\.(jpg|jpeg|png|gif|webp)/i)) {
            return `<img src="${url}" alt="Product" class="w-full h-auto object-cover mb-4" />`;
          }
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${url}</a>`;
        });
        processedLines.push(processedLine);
      }
    }
    
    htmlContent = processedLines.join('\n');

    // Convert markdown headings to HTML
    htmlContent = htmlContent
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');

    // Wrap the content in a paragraph tag if it doesn't start with a heading
    if (!htmlContent.startsWith('<h') && !htmlContent.startsWith('<div class="product-card"')) {
      htmlContent = `<p>${htmlContent}</p>`;
    }

    // Sanitize the HTML content while allowing necessary tags and attributes
    return DOMPurify.sanitize(htmlContent, { 
      ADD_TAGS: ['h1', 'h2', 'h3', 'p', 'br', 'a', 'img', 'div'],
      ADD_ATTR: ['href', 'target', 'rel', 'class', 'src', 'alt'],
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Generated Article
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="prose prose-sm max-w-none space-y-4 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_p]:mb-4 [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline [&_img]:rounded-lg"
          dangerouslySetInnerHTML={{ __html: convertToHtml(content) }}
        />
      </CardContent>
    </Card>
  );
}