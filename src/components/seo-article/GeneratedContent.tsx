import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';

interface GeneratedContentProps {
  content: string;
}

export function GeneratedContent({ content }: GeneratedContentProps) {
  const handleCopy = async () => {
    try {
      // Convert markdown to HTML before copying
      const htmlContent = content
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" style="width: 100%;">')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
        .replace(/^\s*[-*+] (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>\d+\. .*<\/li>\n?)+/g, '<ol>$&</ol>')
        .replace(/^(?!<[uo]l|<li|<h[1-6]|<img|<a)(.*$)/gm, '<p>$1</p>')
        .replace(/\n\n/g, '\n');

      await navigator.clipboard.writeText(htmlContent);
      toast({
        title: "Copied!",
        description: "Article copied to clipboard as HTML",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Generated Article
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy as HTML
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="seo-article-content">
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}