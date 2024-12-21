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

  const renderContent = () => {
    const lines = content.split('\n');
    const elements = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)/i)) {
        // This is an image URL
        elements.push(
          <img 
            key={`img-${i}`}
            src={line} 
            alt="Product" 
            className="w-full h-auto object-cover mb-4 max-h-[400px]" 
            loading="lazy" 
          />
        );
      } else if (line.match(/^https?:\/\/.*\/products\//)) {
        // This is a product URL
        elements.push(
          <a 
            key={`link-${i}`}
            href={line} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary hover:underline block mb-4"
          >
            {line}
          </a>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${i}`} className="text-3xl font-bold mb-4">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-2xl font-bold mb-3">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-xl font-bold mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.length > 0) {
        elements.push(
          <p key={`p-${i}`} className="mb-4">
            {line}
          </p>
        );
      }
    }

    return elements;
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
        <div className="prose prose-sm max-w-none space-y-4">
          {renderContent()}
        </div>
      </CardContent>
    </Card>
  );
}