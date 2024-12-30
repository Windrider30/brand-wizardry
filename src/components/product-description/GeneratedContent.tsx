import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentSection } from "./ContentSection";
import { ListSection } from "./ListSection";

interface GeneratedContentProps {
  content: {
    marketingHooks: string[];
    seoDescriptions: string[];
    metaDescription: string;
    newTitle: string;
  };
}

export function GeneratedContent({ content }: GeneratedContentProps) {
  console.log("GeneratedContent received:", content);

  if (!content) {
    console.log("No content provided to GeneratedContent");
    return null;
  }

  return (
    <div className="space-y-8">
      {content.newTitle && (
        <Card>
          <CardHeader>
            <CardTitle>SEO Title Options</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentSection content={content.newTitle} />
          </CardContent>
        </Card>
      )}

      {Array.isArray(content.marketingHooks) && content.marketingHooks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Marketing Hooks</CardTitle>
          </CardHeader>
          <CardContent>
            <ListSection items={content.marketingHooks} />
          </CardContent>
        </Card>
      )}

      {Array.isArray(content.seoDescriptions) && content.seoDescriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>SEO Descriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {content.seoDescriptions.map((description, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium text-sm text-muted-foreground">Version {index + 1}</h3>
                  <ContentSection content={description} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {content.metaDescription && (
        <Card>
          <CardHeader>
            <CardTitle>Meta Description</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentSection content={content.metaDescription} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}