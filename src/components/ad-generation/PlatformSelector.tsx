import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PlatformSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Platform</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="facebook" id="facebook" />
          <Label htmlFor="facebook">Facebook</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="instagram" id="instagram" />
          <Label htmlFor="instagram">Instagram</Label>
        </div>
      </RadioGroup>
    </div>
  );
}