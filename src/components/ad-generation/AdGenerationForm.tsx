import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandBibleInput } from "./BrandBibleInput";
import { PlatformSelector } from "./PlatformSelector";
import { AdTypeSelector } from "./AdTypeSelector";
import { ProductInfoInputs } from "./ProductInfoInputs";

interface FormData {
  brandBible: string;
  platform: string;
  adType: string;
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
          <BrandBibleInput
            value={formData.brandBible}
            onChange={(value) => setFormData({ ...formData, brandBible: value })}
          />

          <PlatformSelector
            value={formData.platform}
            onChange={(value) => setFormData({ ...formData, platform: value })}
          />

          <AdTypeSelector
            value={formData.adType}
            onChange={(value) => setFormData({ ...formData, adType: value })}
          />

          <ProductInfoInputs
            productUrl={formData.productUrl}
            productTitle={formData.productTitle}
            productDescription={formData.productDescription}
            onProductUrlChange={(value) => setFormData({ ...formData, productUrl: value })}
            onProductTitleChange={(value) => setFormData({ ...formData, productTitle: value })}
            onProductDescriptionChange={(value) => setFormData({ ...formData, productDescription: value })}
          />

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