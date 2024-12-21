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
      // Extract meta description and excerpt
      const metaMatch = content.match(/Meta Description:\s*([^\n]+)/);
      const excerptMatch = content.match(/Excerpt:\s*([^\n]+(?:\n[^\n]+)*)/);
      
      // Remove meta and excerpt from main content for processing
      let mainContent = content
        .replace(/Meta Description:.*$/m, '')
        .replace(/Excerpt:.*$/m, '')
        .trim();

      // Convert main content to HTML
      let htmlContent = mainContent
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
        .replace(/^(?!<[uo]l|<li|<h[1-6]|<img|<a)(.*$)/gm, '<p>$1</p>')
        .replace(/\n\n/g, '\n');

      // Add SEO information section at the end
      if (metaMatch?.[1] || excerptMatch?.[1]) {
        htmlContent += '\n<div class="seo-info" style="margin-top: 40px; padding: 20px; background-color: #f8fafc; border: 2px solid #0EA5E9; border-radius: 8px;">';
        htmlContent += '\n<h2 style="color: #0EA5E9; margin-bottom: 20px;">SEO Information</h2>';
        
        if (metaMatch?.[1]) {
          htmlContent += `\n<div class="meta-description" style="margin-bottom: 20px;">
            <h3 style="color: #0EA5E9; margin-bottom: 10px;">Meta Description:</h3>
            <p style="color: #374151; line-height: 1.6;">${metaMatch[1].trim()}</p>
          </div>`;
        }
        
        if (excerptMatch?.[1]) {
          htmlContent += `\n<div class="excerpt">
            <h3 style="color: #0EA5E9; margin-bottom: 10px;">Excerpt:</h3>
            <p style="color: #374151; line-height: 1.6;">${excerptMatch[1].trim()}</p>
          </div>`;
        }
        
        htmlContent += '\n</div>';
      }

      await navigator.clipboard.writeText(htmlContent);
      toast({
        title: "Copied!",
        description: "Article copied to clipboard as HTML with proper formatting",
      });
    } catch (err) {
      console.error('Error copying content:', err);
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
          {content.includes('Meta Description:') || content.includes('Excerpt:') && (
            <div className="mt-10 p-6 bg-gray-50 border-2 border-[#0EA5E9] rounded-lg">
              <h2 className="text-[#0EA5E9] text-xl font-bold mb-4">SEO Information</h2>
              {content.includes('Meta Description:') && (
                <div className="mb-6">
                  <h3 className="text-[#0EA5E9] font-bold mb-2">Meta Description:</h3>
                  <p className="text-gray-700">
                    {content.match(/Meta Description:\s*([^\n]+)/)?.[1]}
                  </p>
                </div>
              )}
              {content.includes('Excerpt:') && (
                <div>
                  <h3 className="text-[#0EA5E9] font-bold mb-2">Excerpt:</h3>
                  <p className="text-gray-700">
                    {content.match(/Excerpt:\s*([^\n]+(?:\n[^\n]+)*)/)?.[1]}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}