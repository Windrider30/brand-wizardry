import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface DurationToggleProps {
  duration: 'monthly' | 'quarterly' | 'yearly';
  onDurationChange: (duration: 'monthly' | 'quarterly' | 'yearly') => void;
}

export function DurationToggle({ duration, onDurationChange }: DurationToggleProps) {
  return (
    <div className="flex flex-col items-center gap-2 mb-8">
      <span className="text-sm text-muted-foreground">Billing Period</span>
      <ToggleGroup
        type="single"
        value={duration}
        onValueChange={(value) => {
          if (value) onDurationChange(value as 'monthly' | 'quarterly' | 'yearly');
        }}
        className="bg-muted"
      >
        <ToggleGroupItem value="monthly" aria-label="Monthly billing">
          Monthly
        </ToggleGroupItem>
        <ToggleGroupItem value="quarterly" aria-label="Quarterly billing">
          Quarterly
        </ToggleGroupItem>
        <ToggleGroupItem value="yearly" aria-label="Yearly billing">
          Yearly
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}