import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AdGenerationForm } from "@/components/ad-generation/AdGenerationForm";
import { GeneratedContent } from "@/components/ad-generation/GeneratedContent";
import { generateAd } from "@/services/adGenerationService";

export default function AdGeneration() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [formData, setFormData] = useState({
    brandBible: "",
    platform: "facebook",
    adType: "awareness",
    productUrl: "",
    productTitle: "",
    productDescription: "",
  });

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

    if (!formData.productUrl && (!formData.productTitle || !formData.productDescription)) {
      toast({
        title: "Missing Product Information",
        description: "Please provide either a URL or title and description.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.adType) {
      toast({
        title: "Missing Ad Type",
        description: "Please select an ad type.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const content = await generateAd(formData);
      setGeneratedContent(content);
      toast({
        title: "Ad Generated",
        description: "Your ad content has been generated successfully!",
      });
    } catch (error) {
      console.error('Error generating ad:', error);
      toast({
        title: "Error",
        description: "Failed to generate ad content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Generate Social Media Ads</h1>
        <p className="text-gray-600">
          Create compelling Facebook and Instagram ads that align with your brand voice.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <AdGenerationForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
        {generatedContent && (
          <GeneratedContent content={generatedContent} platform={formData.platform} />
        )}
      </div>
    </div>
  );
}