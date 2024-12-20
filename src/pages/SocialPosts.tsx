import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SocialPostsForm } from "@/components/social-posts/SocialPostsForm";
import { GeneratedContent } from "@/components/social-posts/GeneratedContent";
import { generateSocialPost } from "@/services/socialPostsService";

export default function SocialPosts() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [formData, setFormData] = useState({
    brandBible: "",
    platform: "",
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

    if (!formData.platform) {
      toast({
        title: "Missing Platform",
        description: "Please select a social media platform.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.productUrl && (!formData.productTitle || !formData.productDescription)) {
      toast({
        title: "Missing Product Information",
        description: "Please provide either a product URL or title and description.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const content = await generateSocialPost(formData);
      setGeneratedContent(content);
      toast({
        title: "Content Generated",
        description: "Your social media content has been generated successfully!",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate social media content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Generate Social Media Content</h1>
        <p className="text-gray-600">
          Create engaging social media posts for Facebook, Instagram, and Pinterest that align with your brand voice.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <SocialPostsForm
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