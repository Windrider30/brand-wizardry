import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BrandBibleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function BrandBibleInput({ value, onChange }: BrandBibleInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="brandBible">Your Brand Bible</Label>
      <Textarea
        id="brandBible"
        placeholder="Paste your brand bible content here"
        className="min-h-[200px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}