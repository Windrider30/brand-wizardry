import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TitleInput({ value, onChange }: TitleInputProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="title" className="text-lg font-semibold">
        Article Title (Optional)
      </Label>
      <Input
        id="title"
        placeholder="Enter a title or let AI generate one"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-base h-12"
      />
    </div>
  );
}