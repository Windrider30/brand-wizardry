import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SeoArticleForm } from "@/components/seo-article/SeoArticleForm";
import { GeneratedContent } from "@/components/seo-article/GeneratedContent";
import { generateSeoArticle } from "@/services/seoArticleService";

export default function SeoArticle() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    brandBible: "",
    title: "",
    keywords: [] as string[],
    productUrls: [] as string[],
    imageUrls: [] as string[],
  });
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.brandBible.trim()) {
      toast({
        title: "Missing Brand Bible",
        description: "Please paste your brand bible content first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await generateSeoArticle(formData);
      if (result) {
        setGeneratedContent(result.content);
        toast({
          title: "Content Generated",
          description: "Your SEO article has been generated successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate SEO article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Generate SEO Article</h1>
        <p className="text-gray-600">
          Create SEO-optimized articles that incorporate your brand voice and product information.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <SeoArticleForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
        {generatedContent && <GeneratedContent content={generatedContent} />}
      </div>
    </div>
  );
}