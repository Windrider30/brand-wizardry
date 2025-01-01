import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BrandBibleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function BrandBibleInput({ value, onChange }: BrandBibleInputProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="brandBible" className="text-lg font-semibold">
        Your Brand Bible
      </Label>
      <Textarea
        id="brandBible"
        placeholder="Paste your brand bible content here"
        className="min-h-[200px] text-base"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}