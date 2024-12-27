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
      <Card>
        <CardHeader>
          <CardTitle>Suggested Title</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentSection title="Title" content={content.newTitle} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marketing Hooks</CardTitle>
        </CardHeader>
        <CardContent>
          <ListSection title="Marketing Hooks" items={content.marketingHooks} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {content.seoDescriptions && content.seoDescriptions.length > 0 ? (
            <ListSection title="SEO Descriptions" items={content.seoDescriptions} />
          ) : (
            <div className="text-sm text-muted-foreground">No SEO descriptions available</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meta Description</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentSection title="Meta Description" content={content.metaDescription} />
        </CardContent>
      </Card>
    </div>
  );
}