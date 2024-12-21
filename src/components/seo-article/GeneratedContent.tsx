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
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown components={{
            img: ({ node, ...props }) => (
              <img className="w-full h-auto rounded-lg my-6" {...props} alt={props.alt || ''} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="noopener noreferrer" {...props} />
            ),
            h1: ({ node, ...props }) => (
              <h1 className="text-4xl font-bold mt-8 mb-6" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-3xl font-bold mt-7 mb-5" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-2xl font-bold mt-6 mb-4" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-6 my-6 space-y-2" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-6 my-6 space-y-2" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-lg my-4 leading-relaxed" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-bold" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-lg my-2" {...props} />
            )
          }}>
            {content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}