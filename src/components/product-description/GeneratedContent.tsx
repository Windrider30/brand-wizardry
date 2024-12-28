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
  return (
    <div className="space-y-8">
      {content.newTitle && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Title</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentSection title="Title" content={content.newTitle} />
          </CardContent>
        </Card>
      )}

      {content.marketingHooks && content.marketingHooks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Marketing Hooks</CardTitle>
          </CardHeader>
          <CardContent>
            <ListSection title="Marketing Hooks" items={content.marketingHooks} />
          </CardContent>
        </Card>
      )}

      {content.seoDescriptions && content.seoDescriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>SEO Descriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <ListSection title="SEO Descriptions" items={content.seoDescriptions} />
          </CardContent>
        </Card>
      )}

      {content.metaDescription && (
        <Card>
          <CardHeader>
            <CardTitle>Meta Description</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentSection title="Meta Description" content={content.metaDescription} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}