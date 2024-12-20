import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
  brandBible: string;
  platform: string;
  productUrl: string;
  productTitle: string;
  productDescription: string;
}

interface AdGenerationFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function AdGenerationForm({
  formData,
  setFormData,
  onSubmit,
  isLoading,
}: AdGenerationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Ad Content Generator
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
              value={formData.brandBible}
              onChange={(e) => setFormData({ ...formData, brandBible: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Platform</Label>
            <RadioGroup
              value={formData.platform}
              onValueChange={(value) => setFormData({ ...formData, platform: value })}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="facebook" id="facebook" />
                <Label htmlFor="facebook">Facebook</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instagram" id="instagram" />
                <Label htmlFor="instagram">Instagram</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productUrl">Product URL (Optional)</Label>
              <Input
                id="productUrl"
                placeholder="Enter the product URL"
                value={formData.productUrl}
                onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
              />
            </div>

            <div className="text-center text-sm text-gray-500">OR</div>

            <div className="space-y-2">
              <Label htmlFor="productTitle">Product Title</Label>
              <Input
                id="productTitle"
                placeholder="Enter the product title"
                value={formData.productTitle}
                onChange={(e) => setFormData({ ...formData, productTitle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription">Product Description</Label>
              <Textarea
                id="productDescription"
                placeholder="Enter the product description"
                value={formData.productDescription}
                onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Ad...
              </>
            ) : (
              "Generate Ad"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}