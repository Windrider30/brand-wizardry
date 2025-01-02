export function GeneratedContent({ content = {} }: GeneratedContentProps) {
  const {
    marketingHooks = [],
    seoDescriptions = [],
    metaDescription = '',
    seoTitles = []
  } = content;

  console.log("GeneratedContent received:", content);

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
                  <h3 className="font-medium text-sm text-muted-foreground">Version {index + 1}</h3>
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
                  <h3 className="font-medium text-sm text-muted-foreground">Hook {index + 1}</h3>
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
                  <h3 className="font-medium text-sm text-muted-foreground">Version {index + 1}</h3>
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
