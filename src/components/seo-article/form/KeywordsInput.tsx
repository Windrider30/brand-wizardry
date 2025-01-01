import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface KeywordsInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
}

export function KeywordsInput({ keywords, onChange }: KeywordsInputProps) {
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Split by comma, handle multiple spaces, and filter empty strings
    const newKeywords = inputValue
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
    
    onChange(newKeywords);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="keywords" className="text-lg font-semibold">
        SEO Keywords (Optional, comma-separated)
      </Label>
      <Input
        id="keywords"
        placeholder="Enter keywords separated by commas, e.g.: seo, marketing, content"
        value={keywords.join(', ')}
        onChange={handleKeywordChange}
        className="text-base h-12"
      />
    </div>
  );
}