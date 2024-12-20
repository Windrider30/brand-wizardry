import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface GeneratedContentProps {
  content: string;
  platform: string;
}

export function GeneratedContent({ content, platform }: GeneratedContentProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Social media post copied to clipboard",
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
          Generated {platform} Post
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap">{content}</div>
      </CardContent>
    </Card>
  );
}