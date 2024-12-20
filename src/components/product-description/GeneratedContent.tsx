import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductDescriptionResponse } from "@/services/productDescriptionService";

interface GeneratedContentProps {
  content: ProductDescriptionResponse;
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
            <div className="text-sm whitespace-pre-wrap">{content.newTitle}</div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Marketing Hooks</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4 space-y-2">
            {content.marketingHooks.map((hook, index) => (
              <li key={index} className="text-sm">{hook}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {content.seoDescriptions.map((desc, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-sm font-medium">Version {index + 1}</h3>
                <p className="text-sm whitespace-pre-wrap">{desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meta Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm whitespace-pre-wrap">{content.metaDescription}</div>
        </CardContent>
      </Card>
    </div>
  );
}