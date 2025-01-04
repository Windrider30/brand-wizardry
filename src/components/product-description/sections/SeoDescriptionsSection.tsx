import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentSection } from "../ContentSection";

interface SeoDescriptionsSectionProps {
  descriptions: string[];
}

export function SeoDescriptionsSection({ descriptions }: SeoDescriptionsSectionProps) {
  if (!descriptions || descriptions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Descriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {descriptions.map((description, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                Version {index + 1}
              </h3>
              <ContentSection content={description} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}