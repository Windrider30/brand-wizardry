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
    const lines = content.split('\n');
    const processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const currentLine = lines[i].trim();
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      
      // Check if current line is an image URL and next line is a product URL
      if (
        currentLine.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)/i) &&
        nextLine.match(/^https?:\/\/.*\/products\//)
      ) {
        processedLines.push(`
          <div class="product-card mb-6 rounded-lg overflow-hidden border border-gray-200">
            <img src="${currentLine}" alt="Product" class="w-full h-auto object-cover max-h-[400px]" loading="lazy" />
            <div class="p-4">
              <a href="${nextLine}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline block">
                View Product
              </a>
            </div>
          </div>
        `);
        i++; // Skip the next line since we've processed it
      } else {
        // Handle regular URLs and standalone images
        let processedLine = currentLine;
        
        // Convert image URLs to img tags
        if (currentLine.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)/i)) {
          processedLine = `<img src="${currentLine}" alt="Product" class="w-full h-auto object-cover mb-4 max-h-[400px]" loading="lazy" />`;
        } 
        // Convert product URLs to links
        else if (currentLine.match(/^https?:\/\/.*\/products\//)) {
          processedLine = `<a href="${currentLine}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline block mb-4">View Product</a>`;
        }
        // Convert markdown headings and regular text
        else {
          // Convert markdown headings
          processedLine = processedLine
            .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mb-2">$1</h3>');
          
          // If it's not a heading, wrap in paragraph tags if needed
          if (!processedLine.startsWith('<h') && processedLine.length > 0) {
            processedLine = `<p class="mb-4">${processedLine}</p>`;
          }
        }
        
        processedLines.push(processedLine);
      }
    }
    
    // Join all processed lines
    const htmlContent = processedLines.join('\n');
    
    // Sanitize the HTML content
    return DOMPurify.sanitize(htmlContent, {
      ADD_TAGS: ['h1', 'h2', 'h3', 'p', 'br', 'a', 'img', 'div'],
      ADD_ATTR: ['href', 'target', 'rel', 'class', 'src', 'alt', 'loading'],
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