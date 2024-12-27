import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductDescriptionResponse } from "@/services/productDescriptionService";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface GeneratedContentProps {
  content: ProductDescriptionResponse;
}

export function GeneratedContent({ content }: GeneratedContentProps) {
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
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
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Suggested Title</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-3 bg-muted rounded-lg">
            <div className="text-sm">{content.newTitle}</div>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(content.newTitle)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marketing Hooks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {content.marketingHooks.map((hook, index) => (
              <div key={index} className="flex items-center justify-between gap-4 p-3 bg-muted rounded-lg">
                <div className="text-sm">{hook}</div>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(hook)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.seoDescriptions && content.seoDescriptions.map((desc, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-sm font-medium">Version {index + 1}</h3>
                <div className="flex items-center justify-between gap-4 p-3 bg-muted rounded-lg">
                  <div className="text-sm whitespace-pre-wrap">{desc}</div>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(desc)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meta Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 p-3 bg-muted rounded-lg">
            <div className="text-sm whitespace-pre-wrap">{content.metaDescription}</div>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(content.metaDescription)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}