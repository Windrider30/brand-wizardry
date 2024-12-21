import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormData {
  brandBible: string;
  title: string;
  keywords: string[];
  productUrls: string[];
  imageUrls: string[];
}

interface SeoArticleFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function SeoArticleForm({
  formData,
  setFormData,
  onSubmit,
  isLoading,
}: SeoArticleFormProps) {
  const handleAddUrl = (type: 'product' | 'image') => {
    const array = type === 'product' ? formData.productUrls : formData.imageUrls;
    const newArray = [...array, ''];
    setFormData({
      ...formData,
      [type === 'product' ? 'productUrls' : 'imageUrls']: newArray,
    });
  };

  const handleRemoveUrl = (index: number, type: 'product' | 'image') => {
    const array = type === 'product' ? formData.productUrls : formData.imageUrls;
    const newArray = array.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [type === 'product' ? 'productUrls' : 'imageUrls']: newArray,
    });
  };

  const handleUrlChange = (index: number, value: string, type: 'product' | 'image') => {
    const array = type === 'product' ? formData.productUrls : formData.imageUrls;
    const newArray = [...array];
    newArray[index] = value;
    setFormData({
      ...formData,
      [type === 'product' ? 'productUrls' : 'imageUrls']: newArray,
    });
  };

  const handleKeywordChange = (value: string) => {
    const keywords = value.split(',').map(k => k.trim()).filter(Boolean);
    setFormData({ ...formData, keywords });
  };

  return (
    <Card className="p-6">
      <CardHeader className="px-0">
        <CardTitle className="flex items-center gap-3 text-3xl">
          <Sparkles className="h-8 w-8 text-primary" />
          SEO Article Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="brandBible" className="text-lg font-semibold">
              Your Brand Bible
            </Label>
            <Textarea
              id="brandBible"
              placeholder="Paste your brand bible content here"
              className="min-h-[200px] text-base"
              value={formData.brandBible}
              onChange={(e) => setFormData({ ...formData, brandBible: e.target.value })}
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="title" className="text-lg font-semibold">
              Article Title (Optional)
            </Label>
            <Input
              id="title"
              placeholder="Enter a title or let AI generate one"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="text-base h-12"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="keywords" className="text-lg font-semibold">
              SEO Keywords (Optional, comma-separated)
            </Label>
            <Input
              id="keywords"
              placeholder="Enter keywords or let AI generate them"
              value={formData.keywords.join(', ')}
              onChange={(e) => handleKeywordChange(e.target.value)}
              className="text-base h-12"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-semibold">Product URLs</Label>
            {formData.productUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Enter product URL"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value, 'product')}
                  className="text-base h-12"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveUrl(index, 'product')}
                  className="h-12 w-12"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base"
              onClick={() => handleAddUrl('product')}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Product URL
            </Button>
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-semibold">Image URLs</Label>
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Enter image URL"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value, 'image')}
                  className="text-base h-12"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveUrl(index, 'image')}
                  className="h-12 w-12"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base"
              onClick={() => handleAddUrl('image')}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Image URL
            </Button>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Article...
              </>
            ) : (
              "Generate Article"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}