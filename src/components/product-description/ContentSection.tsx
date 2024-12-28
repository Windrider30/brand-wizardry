import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ContentSectionProps {
  title: string;
  content: string;
}

export function ContentSection({ title, content }: ContentSectionProps) {
  if (!content) {
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
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 p-3 bg-muted rounded-lg">
      <div className="flex-1">
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}