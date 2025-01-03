
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
  // Destructuring with default values to handle undefined properties
  const {
    marketingHooks = [],
    seoDescriptions = [],
    metaDescription = '',
    seoTitles = [],
  } = content;

  console.log("GeneratedContent received:", content);

  return (
    <div className="space-y-8">
      {/* SEO Titles */}
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

      {/* Marketing Hooks */}
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

      {/* SEO Descriptions */}
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

      {/* Meta Description */}
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
