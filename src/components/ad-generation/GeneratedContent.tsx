import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface GeneratedContentProps {
  content: {
    primaryTexts: string[];
    headlines: string[];
    descriptions: string[];
  };
  platform: string;
}

export function GeneratedContent({ content, platform }: GeneratedContentProps) {
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

  const renderSection = (title: string, items: string[]) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start justify-between gap-4 p-3 bg-muted rounded-lg">
            <p className="flex-1">{item}</p>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(item)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generated {platform} Ad</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="primary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="primary">Primary Texts</TabsTrigger>
            <TabsTrigger value="headlines">Headlines</TabsTrigger>
            <TabsTrigger value="descriptions">Descriptions</TabsTrigger>
          </TabsList>
          <TabsContent value="primary" className="space-y-4">
            {renderSection("Primary Texts (125 chars max)", content.primaryTexts)}
          </TabsContent>
          <TabsContent value="headlines" className="space-y-4">
            {renderSection("Headlines (225 chars max)", content.headlines)}
          </TabsContent>
          <TabsContent value="descriptions" className="space-y-4">
            {renderSection("Ad Descriptions", content.descriptions)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}