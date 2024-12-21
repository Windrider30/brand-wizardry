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

  // Function to extract and clean the HTML content from the code block
  const extractHtmlContent = (content: string) => {
    // Remove the markdown code block syntax if present
    const htmlContent = content.replace(/```html\n|```/g, '');
    // Sanitize the HTML content
    return DOMPurify.sanitize(htmlContent, { 
      ADD_TAGS: ['a', 'h1', 'h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'img'],
      ADD_ATTR: ['href', 'target', 'src', 'alt']
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
          className="prose prose-sm max-w-none [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800 [&_img]:max-w-full [&_img]:h-auto [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-4"
          dangerouslySetInnerHTML={{ __html: extractHtmlContent(content) }}
        />
      </CardContent>
    </Card>
  );
}