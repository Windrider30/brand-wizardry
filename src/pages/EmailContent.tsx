import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { EmailContentForm } from "@/components/email-content/EmailContentForm";
import { GeneratedContent } from "@/components/email-content/GeneratedContent";
import { generateEmailContent } from "@/services/emailContentService";

export default function EmailContent() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [formData, setFormData] = useState({
    brandBible: "",
    contentType: "product", // or "collection"
    productUrl: "",
    title: "",
    description: "",
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

    if (!formData.productUrl && (!formData.title || !formData.description)) {
      toast({
        title: "Missing Content Information",
        description: "Please provide either a URL or title and description.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const content = await generateEmailContent(formData);
      setGeneratedContent(content);
      toast({
        title: "Content Generated",
        description: "Your email content has been generated successfully!",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Error",
        description: "Failed to generate email content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Generate Email Content</h1>
        <p className="text-gray-600">
          Create compelling email content for your products and collections that aligns with your brand voice.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <EmailContentForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
        {generatedContent && (
          <GeneratedContent content={generatedContent} />
        )}
      </div>
    </div>
  );
}