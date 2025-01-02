import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface KeywordsInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
}

export function KeywordsInput({ keywords, onChange }: KeywordsInputProps) {
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Always update with the current input value, allowing spaces and commas
    if (inputValue === '') {
      onChange([]);
    } else if (inputValue.endsWith(',')) {
      // When user adds a comma, split into keywords
      const newKeywords = inputValue
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
      onChange(newKeywords);
    } else {
      // During typing, treat as keywords only if there are commas
      const newKeywords = inputValue.includes(',')
        ? inputValue
            .split(',')
            .map(keyword => keyword.trim())
            .filter(keyword => keyword.length > 0)
        : [inputValue.trim()];
      onChange(newKeywords);
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="keywords" className="text-lg font-semibold">
        SEO Keywords (Optional, comma-separated)
      </Label>
      <Input
        id="keywords"
        placeholder="Enter keywords separated by commas, e.g.: content marketing, social media strategy"
        value={keywords.join(', ')}
        onChange={handleKeywordChange}
        className="text-base h-12"
      />
    </div>
  );
}