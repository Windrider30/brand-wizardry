import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentSection } from "../ContentSection";

interface MarketingHooksSectionProps {
  hooks: string[];
}

export function MarketingHooksSection({ hooks }: MarketingHooksSectionProps) {
  if (!hooks || hooks.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marketing Hooks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hooks.map((hook, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                Hook {index + 1}
              </h3>
              <ContentSection content={hook} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}