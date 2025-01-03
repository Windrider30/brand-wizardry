import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentSection } from "./ContentSection";

interface GeneratedContentProps {
  content: {
    marketingHooks: string[];
    seoDescriptions: string[];
    metaDescription: string;
    seoTitles: string[];
  };
}

export function GeneratedContent({ content = {} }: GeneratedContentProps) {
  const {
    marketingHooks = [],
    seoDescriptions = [],
    metaDescription = '',
    seoTitles = []
  } = content;

  // Filter out empty or separator entries if needed
  const filteredMarketingHooks = marketingHooks.filter(hook => hook.trim() !== '');
  const filteredSeoTitles = seoTitles.filter(title => title.trim() !== '');
  const filteredSeoDescriptions = seoDescriptions.filter(description => description.trim() !== '');

  console.log("SEO Titles before render:", filteredSeoTitles);
  console.log("SEO Descriptions before render:", filteredSeoDescriptions);
  console.log("Marketing Hooks before render:", filteredMarketingHooks);
  console.log("Meta Description:", metaDescription !== '');

  return (
    <div className="space-y-8">
      {filteredSeoTitles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>SEO Title Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSeoTitles.map((title, index) => (
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

      {filteredMarketingHooks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Marketing Hooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMarketingHooks.map((hook, index) => (
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

      {filteredSeoDescriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>SEO Descriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredSeoDescriptions.map((description, index) => (
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
