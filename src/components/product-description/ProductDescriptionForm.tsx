import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductInfo {
  brandBible: string;
  name: string;
  features: string;
}

interface ProductDescriptionFormProps {
  productInfo: ProductInfo;
  setProductInfo: (info: ProductInfo) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ProductDescriptionForm({
  productInfo,
  setProductInfo,
  onSubmit,
  isLoading,
}: ProductDescriptionFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Product Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
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
  );
}