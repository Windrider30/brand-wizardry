import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
  brandBible: string;
  contentType: string;
  productUrl: string;
  title: string;
  description: string;
}

interface EmailContentFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function EmailContentForm({
  formData,
  setFormData,
  onSubmit,
  isLoading,
}: EmailContentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Email Content Generator
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
            <Label>Content Type</Label>
            <RadioGroup
              value={formData.contentType}
              onValueChange={(value) => setFormData({ ...formData, contentType: value })}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="product" id="product" />
                <Label htmlFor="product">Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="collection" id="collection" />
                <Label htmlFor="collection">Collection</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productUrl">Product/Collection URL (Optional)</Label>
              <Input
                id="productUrl"
                placeholder="Enter the URL"
                value={formData.productUrl}
                onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
              />
            </div>

            <div className="text-center text-sm text-gray-500">OR</div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter the title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter the description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
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