import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface KeywordsInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
}

export function KeywordsInput({ keywords, onChange }: KeywordsInputProps) {
  const [inputValue, setInputValue] = useState(keywords.join(", ")); // Temporary state for user input

  useEffect(() => {
    setInputValue(keywords.join(", ")); // Sync inputValue with keywords when keywords change externally
  }, [keywords]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // Update the raw input value immediately
  };

  const handleBlurOrEnter = () => {
    // Process the input only when the user confirms their input
    const newKeywords = inputValue
      .split(/[,\s]+/) // Split by commas or spaces
      .map((keyword) => keyword.trim()) // Trim whitespace
      .filter((keyword) => keyword.length > 0); // Remove empty keywords

    onChange(newKeywords); // Pass processed keywords to parent
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlurOrEnter();
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="keywords" className="text-lg font-semibold">
        SEO Keywords (Optional, separated by commas or spaces)
      </Label>
      <Input
        id="keywords"
        type="text"
        placeholder="Enter keywords separated by commas or spaces, e.g.: content marketing, social media strategy"
        value={inputValue} // Controlled input value
        onChange={handleInputChange}
        onBlur={handleBlurOrEnter} // Trigger processing on blur
        onKeyPress={handleKeyPress} // Handle Enter key
        className="text-base h-12"
        autoComplete="off"
      />
      {/* Debug display */}
      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-gray-500 mt-1">
          Current keywords: {JSON.stringify(keywords)}
        </div>
      )}
    </div>
  );
}
