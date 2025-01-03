import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentSection } from "./ContentSection";

interface GeneratedContentProps {
  content?: {
    rawContent?: string;
  };
}

function parseContent(rawContent: string) {
  if (!rawContent) return { seoTitles: [], marketingHooks: [], seoDescriptions: [] };

  // Use regex to split and match each section
  const seoTitlesMatch = rawContent.match(/SEO Title Options([\s\S]*?)---/);
  const marketingHooksMatch = rawContent.match(/Marketing Hooks([\s\S]*?)---/);
  const seoDescriptionsMatch = rawContent.match(/SEO Descriptions([\s\S]*?)---/);
  const metaDescriptionMatch = rawContent.match(/Meta Description\s*(.*)/);

  const seoTitles = seoTitlesMatch
    ? seoTitlesMatch[1].match(/"(.*?)"/g)?.map(item => item.slice(1, -1)) || []
    : [];

  const marketingHooks = marketingHooksMatch
    ? marketingHooksMatch[1].split('\n').filter(line => line.includes('"')).map(line => {
        const hookMatch = line.match(/"(.*?)"/);
        return hookMatch ? hookMatch[1] : '';
      })
    : [];

  const seoDescriptions = seoDescriptionsMatch
    ? seoDescriptionsMatch[1].split('\n').filter(line => line.trim()).map(line => line.trim())
    : [];

  const metaDescription = metaDescriptionMatch ? metaDescriptionMatch[1].trim() : '';

  return { seoTitles, marketingHooks, seoDescriptions, metaDescription };
}

export function GeneratedContent({ content = { rawContent: "" } }: GeneratedContentProps) {
  const rawContent = content?.rawContent || "";
  const { seoTitles, marketingHooks, seoDescriptions, metaDescription } = parseContent(rawContent);

  console.log("Parsed SEO Titles:", seoTitles);
  console.log("Parsed Marketing Hooks:", marketingHooks);
  console.log("Parsed SEO Descriptions:", seoDescriptions);
  console.log("Meta Description:", metaDescription);

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
