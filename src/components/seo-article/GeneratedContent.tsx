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

  // Function to convert text content to HTML with clickable links
  const convertToHtml = (content: string) => {
    // Remove any existing HTML tags first
    let htmlContent = content.replace(/<[^>]*>/g, '');
    
    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    htmlContent = htmlContent.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${url}</a>`;
    });

    // Convert markdown headings to HTML
    htmlContent = htmlContent
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');

    // Wrap the content in a paragraph tag if it doesn't start with a heading
    if (!htmlContent.startsWith('<h')) {
      htmlContent = `<p>${htmlContent}</p>`;
    }

    // Sanitize the HTML content while allowing links
    return DOMPurify.sanitize(htmlContent, { 
      ADD_TAGS: ['h1', 'h2', 'h3', 'p', 'br', 'a'],
      ADD_ATTR: ['href', 'target', 'rel', 'class']
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
          className="prose prose-sm max-w-none space-y-4 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_p]:mb-4 [&_a]:text-primary [&_a]:no-underline hover:[&_a]:underline"
          dangerouslySetInnerHTML={{ __html: convertToHtml(content) }}
        />
      </CardContent>
    </Card>
  );
}