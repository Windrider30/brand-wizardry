import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ContentSectionProps {
  content: string;
}

export function ContentSection({ content }: ContentSectionProps) {
  console.log("ContentSection received:", content);

  if (!content) {
    console.log("No content provided to ContentSection");
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (err) {
      console.error("Error copying to clipboard:", err);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 p-4 bg-muted rounded-lg">
      <div className="flex-1">
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={handleCopy} className="shrink-0">
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}