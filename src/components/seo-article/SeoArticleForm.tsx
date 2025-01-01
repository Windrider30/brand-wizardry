import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { BrandBibleInput } from "./form/BrandBibleInput";
import { TitleInput } from "./form/TitleInput";
import { KeywordsInput } from "./form/KeywordsInput";
import { UrlInputList } from "./form/UrlInputList";
import { SubmitButton } from "./form/SubmitButton";

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
          <BrandBibleInput
            value={formData.brandBible}
            onChange={(value) => setFormData({ ...formData, brandBible: value })}
          />

          <TitleInput
            value={formData.title}
            onChange={(value) => setFormData({ ...formData, title: value })}
          />

          <KeywordsInput
            keywords={formData.keywords}
            onChange={(keywords) => setFormData({ ...formData, keywords })}
          />

          <UrlInputList
            type="product"
            urls={formData.productUrls}
            onChange={(urls) => setFormData({ ...formData, productUrls: urls })}
          />

          <UrlInputList
            type="image"
            urls={formData.imageUrls}
            onChange={(urls) => setFormData({ ...formData, imageUrls: urls })}
          />

          <SubmitButton isLoading={isLoading} />
        </form>
      </CardContent>
    </Card>
  );
}