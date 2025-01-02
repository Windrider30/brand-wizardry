import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface KeywordsInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
}

export function KeywordsInput({ keywords, onChange }: KeywordsInputProps) {
  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // If the input is empty, update with an empty array
    if (inputValue.trim() === '') {
      onChange([]);
      return;
    }

    // Split by commas and spaces, and filter out empty values
    const newKeywords = inputValue
      .split(/[\s,]+/) // Split by any combination of spaces or commas
      .map((keyword) => keyword.trim()) // Remove leading/trailing whitespace
      .filter((keyword) => keyword.length > 0); // Remove empty strings

    // Update the parent component with the new array of keywords
    onChange(newKeywords);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="keywords" className="text-lg font-semibold">
        SEO Keywords (Optional, separated by commas or spaces)
      </Label>
      <Input
        id="keywords"
        placeholder="Enter keywords separated by commas or spaces, e.g.: content marketing, social media strategy"
        value={keywords.join(', ')} // Show keywords as a comma-separated string
        onChange={handleKeywordChange}
        className="text-base h-12"
      />
    </div>
  );
}