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
      // First, extract meta description and excerpt
      const metaMatch = content.match(/Meta Description:(.*?)(?=\n\n|\n#|$)/s);
      const excerptMatch = content.match(/Excerpt:(.*?)(?=\n\n|\n#|$)/s);
      
      // Convert markdown to HTML with special handling for meta and excerpt
      let htmlContent = content
        // Handle meta description and excerpt first
        .replace(/Meta Description:(.*?)(?=\n\n|\n#|$)/gs, '<div class="meta-description"><h3>Meta Description:</h3><p>$1</p></div>')
        .replace(/Excerpt:(.*?)(?=\n\n|\n#|$)/gs, '<div class="excerpt"><h3>Excerpt:</h3><p>$1</p></div>')
        // Then handle the rest of the content
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" style="width: 100%;">')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #0EA5E9; text-decoration: none; transition: color 0.2s;" onmouseover="this.style.color=\'#0284C7\'" onmouseout="this.style.color=\'#0EA5E9\'">$1</a>')
        .replace(/^\s*[-*+] (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>\d+\. .*<\/li>\n?)+/g, '<ol>$&</ol>')
        .replace(/^(?!<[uo]l|<li|<h[1-6]|<img|<a|<div)(.*$)/gm, '<p>$1</p>')
        .replace(/\n\n/g, '\n');

      await navigator.clipboard.writeText(htmlContent);
      toast({
        title: "Copied!",
        description: "Article copied to clipboard as HTML with proper formatting",
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