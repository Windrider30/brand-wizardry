import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateProductDescription, ProductDescriptionResponse } from "@/services/productDescriptionService";
import { ProductDescriptionForm } from "@/components/product-description/ProductDescriptionForm";
import { GeneratedContent } from "@/components/product-description/GeneratedContent";

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
        <ProductDescriptionForm
          productInfo={productInfo}
          setProductInfo={setProductInfo}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
        {generatedContent && <GeneratedContent content={generatedContent} />}
      </div>
    </div>
  );
}