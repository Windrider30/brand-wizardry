import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { generateProductDescription, ProductDescriptionResponse } from "@/services/productDescriptionService";

export default function ProductDescription() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [productInfo, setProductInfo] = useState({
    brandBible: "",
    name: "",
    features: "",
  });
  const [generatedContent, setGeneratedContent] = useState<ProductDescriptionResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productInfo.brandBible.trim()) {
      toast({
        title: "Missing Brand Bible",
        description: "Please paste your brand bible content first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await generateProductDescription(productInfo);
      if (result) {
        setGeneratedContent(result);
        toast({
          title: "Content Generated",
          description: "Your product content has been generated successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate product content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Generate Product Content</h1>
        <p className="text-gray-600">
          Create compelling product descriptions and marketing content that aligns with your brand voice.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brandBible">Your Brand Bible</Label>
                <Textarea
                  id="brandBible"
                  placeholder="Paste your brand bible content here"
                  className="min-h-[200px]"
                  value={productInfo.brandBible}
                  onChange={(e) => setProductInfo({ ...productInfo, brandBible: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  placeholder="e.g., Shadow Fae's Embrace Blanket"
                  value={productInfo.name}
                  onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Key Features & Benefits</Label>
                <Textarea
                  id="features"
                  placeholder="List the main features and benefits of your product"
                  value={productInfo.features}
                  onChange={(e) => setProductInfo({ ...productInfo, features: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  "Generate Content"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {generatedContent && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Hooks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-4 space-y-2">
                  {generatedContent.marketingHooks.map((hook, index) => (
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
                <div className="space-y-6">
                  {generatedContent.seoDescriptions.map((desc, index) => (
                    <div key={index} className="prose prose-sm">
                      <h3 className="text-sm font-medium mb-2">Version {index + 1}</h3>
                      <div className="whitespace-pre-wrap text-sm">{desc}</div>
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
                <div className="text-sm whitespace-pre-wrap">{generatedContent.metaDescription}</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}