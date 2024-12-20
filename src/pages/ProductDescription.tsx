import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { generateProductDescription } from "@/services/productDescriptionService";

export default function ProductDescription() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [productInfo, setProductInfo] = useState({
    brandBible: "",
    name: "",
    features: "",
  });
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);

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
        setGeneratedDescription(result);
        toast({
          title: "Description Generated",
          description: "Your product description is ready!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate product description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Generate Product Descriptions</h1>
        <p className="text-gray-600">
          Create compelling product descriptions that align with your brand voice.
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
                  placeholder="e.g., Comfort Plus Memory Foam Pillow"
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
                    Generating Description...
                  </>
                ) : (
                  "Generate Description"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {generatedDescription && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">{generatedDescription}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}