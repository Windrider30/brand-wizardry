import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

interface KeywordsInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
}

export function KeywordsInput({ keywords, onChange }: KeywordsInputProps) {
  // Add debugging to track state changes
  useEffect(() => {
    console.log("Current keywords state:", keywords);
  }, [keywords]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    console.log("Raw input value:", inputValue); // Debug raw input

    // If the input is empty, update with an empty array
    if (inputValue.trim() === '') {
      console.log("Empty input detected, clearing keywords");
      onChange([]);
      return;
    }

    // Keep the original input value for display
    const displayValue = inputValue;
    console.log("Display value:", displayValue);

    // Only process keywords when there's actual content
    const newKeywords = inputValue
      .split(/[,\s]+/) // Split by commas or spaces
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);

    console.log("Processed keywords:", newKeywords); // Debug processed keywords
    onChange(newKeywords);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="keywords" className="text-lg font-semibold">
        SEO Keywords (Optional, separated by commas or spaces)
      </Label>
      <Input
        id="keywords"
        type="text" // Explicitly set type to text
        placeholder="Enter keywords separated by commas or spaces, e.g.: content marketing, social media strategy"
        value={keywords.join(', ')}
        onChange={handleKeywordChange}
        className="text-base h-12"
        // Remove any potential restrictions
        maxLength={undefined}
        pattern={undefined}
        autoComplete="off"
      />
      {/* Debug display */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mt-1">
          Current keywords: {JSON.stringify(keywords)}
        </div>
      )}
    </div>
  );
}
