import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentSection } from "../ContentSection";

interface SeoTitlesSectionProps {
  titles: string[];
}

export function SeoTitlesSection({ titles }: SeoTitlesSectionProps) {
  if (!titles || titles.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Title Options</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {titles.map((title, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                Version {index + 1}
              </h3>
              <ContentSection content={title} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}