import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentSection } from "./ContentSection";

interface GeneratedContentProps {
  content?: {
    rawContent?: string;
  };
}

function parseContent(rawContent: string) {
  if (!rawContent) return { seoTitles: [], marketingHooks: [], seoDescriptions: [] };

  const sections = rawContent.match(/[\s\S]*?---/g);

  const seoTitles = sections && sections[0]
    ? sections[0].match(/"(.*?)"/g)?.map(item => item.slice(1, -1)) || []
    : [];

  const marketingHooks = sections && sections[1]
    ? sections[1].split('\n').filter(line => line.includes('"')).map(line => {
        const hookMatch = line.match(/"(.*?)"/);
        return hookMatch ? hookMatch[1] : '';
      })
    : [];

  const seoDescriptions = sections && sections[2]
    ? sections[2].split('\n').filter(line => line.includes(':')).map(line => {
        const descStart = line.indexOf(':') + 1;
        return line.substring(descStart).trim();
      })
    : [];

  return { seoTitles, marketingHooks, seoDescriptions };
}

export function GeneratedContent({ content = { rawContent: "" } }: GeneratedContentProps) {
  const rawContent = content?.rawContent || "";
  const { seoTitles, marketingHooks, seoDescriptions } = parseContent(rawContent);

  console.log("Parsed SEO Titles:", seoTitles);
  console.log("Parsed Marketing Hooks:", marketingHooks);
  console.log("Parsed SEO Descriptions:", seoDescriptions);

  const metaDescription = rawContent.match(/Meta Description\s*(.*)/)?.[1] || '';

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
