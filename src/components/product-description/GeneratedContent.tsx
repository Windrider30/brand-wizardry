import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentSection } from "./ContentSection";

interface GeneratedContentProps {
  content?: {
    rawContent?: string;
  };
}

function parseContent(rawContent: string) {
  if (!rawContent) return { seoTitles: [], marketingHooks: [], seoDescriptions: [] };

  const sections = rawContent.split('---');
  const seoTitles = sections[1]?.split('\n').filter(line => line.includes('"')).map(item => item.trim().replace(/"/g, '')) || [];
  const marketingHooks = sections[2]?.split('\n').filter(line => line.includes(':')).map(line => line.split(':')[1].trim()) || [];
  const seoDescriptions = sections[3]?.split('\n').filter(line => line.startsWith('**Description')).map((_, index, array) => {
    const descStart = array[index].indexOf(':') + 1;
    return array[index].substring(descStart).trim();
  }) || [];

  return { seoTitles, marketingHooks, seoDescriptions };
}

export function GeneratedContent({ content = { rawContent: "" } }: GeneratedContentProps) {
  const rawContent = content?.rawContent || "";
  const { seoTitles, marketingHooks, seoDescriptions } = parseContent(rawContent);

  console.log("Parsed SEO Titles:", seoTitles);
  console.log("Parsed Marketing Hooks:", marketingHooks);
  console.log("Parsed SEO Descriptions:", seoDescriptions);

  const metaDescription = rawContent.split('Meta Description')[1]?.trim() || '';

  return (
    <div className="space-y-8">
      {seoTitles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>SEO Title Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seoTitles.map((title, index) => (
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
      )}

      {marketingHooks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Marketing Hooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketingHooks.map((hook, index) => (
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
      )}

      {seoDescriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>SEO Descriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {seoDescriptions.map((description, index) => (
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
      )}

      {metaDescription && (
        <Card>
          <CardHeader>
            <CardTitle>Meta Description</CardTitle>
          </CardHeader>
          <CardContent>
            <ContentSection content={metaDescription} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
