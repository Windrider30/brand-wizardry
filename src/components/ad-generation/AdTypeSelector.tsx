import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function AdTypeSelector({ value, onChange }: AdTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Ad Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select ad type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="awareness">Awareness Ads</SelectItem>
          <SelectItem value="traffic">Traffic Ads</SelectItem>
          <SelectItem value="engagement">Engagement Ads</SelectItem>
          <SelectItem value="lead-generation">Lead Generation Ads</SelectItem>
          <SelectItem value="app-promotion">App Promotion Ads</SelectItem>
          <SelectItem value="sales">Sales Ads</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}