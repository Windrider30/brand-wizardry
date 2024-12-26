import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { generateBrandBible } from "@/services/brandBibleService";

export default function BrandBible() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [brandInfo, setBrandInfo] = useState({
    name: "",
    product: "",
    vibe: "",
    brandStyle: "modern"
  });

  const [brandBible, setBrandBible] = useState<string | null>(null);
  const [targetMarket, setTargetMarket] = useState<string | null>(null);
  const [brandVoice, setBrandVoice] = useState<string | null>(null);
  const [personas, setPersonas] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await generateBrandBible(brandInfo);
      if (result) {
        // Split the content into sections based on clear section headers
        const sections = result.split(/(?=Basic Brand Bible|Target Market Analysis|Brand Voice|Buyer & Negative Personas)/i);
        
        setBrandBible(sections[1] || ''); // Basic Brand Bible section
        setTargetMarket(sections[2] || ''); // Target Market Analysis section
        setBrandVoice(sections[3] || ''); // Brand Voice section
        setPersonas(sections[4] || ''); // Buyer & Negative Personas section

        toast({
          title: "Brand Bible Generated",
          description: "Your comprehensive brand bible is ready!",
        });
      }
    } catch (error) {
      console.error('Error generating brand bible:', error);
      toast({
        title: "Error",
        description: "Failed to generate brand bible. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-7xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-500">Create Your Brand Bible</h1>
        <p className="text-gray-600">
          Let our AI personas craft a comprehensive brand bible for your business.
          Just provide some basic information to get started.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Brand Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  placeholder="e.g., The Blanket Nook"
                  value={brandInfo.name}
                  onChange={(e) => setBrandInfo({ ...brandInfo, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">What are you selling?</Label>
                <Textarea
                  id="product"
                  placeholder="Describe your main products or services"
                  value={brandInfo.product}
                  onChange={(e) => setBrandInfo({ ...brandInfo, product: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vibe">Desired Brand Vibe</Label>
                <Textarea
                  id="vibe"
                  placeholder="Describe the feeling you want your brand to evoke"
                  value={brandInfo.vibe}
                  onChange={(e) => setBrandInfo({ ...brandInfo, vibe: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Brand Style</Label>
                <RadioGroup
                  value={brandInfo.brandStyle}
                  onValueChange={(value) => setBrandInfo({ ...brandInfo, brandStyle: value })}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="modern" id="modern" />
                    <Label htmlFor="modern">Modern & Minimal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="traditional" id="traditional" />
                    <Label htmlFor="traditional">Traditional & Classic</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="playful" id="playful" />
                    <Label htmlFor="playful">Playful & Creative</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="luxury" id="luxury" />
                    <Label htmlFor="luxury">Luxury & Premium</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Brand Bible...
                  </>
                ) : (
                  "Generate Brand Bible"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {brandBible && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Brand Bible</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{brandBible}</div>
              </CardContent>
            </Card>
          )}

          {targetMarket && (
            <Card>
              <CardHeader>
                <CardTitle>Target Market Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{targetMarket}</div>
              </CardContent>
            </Card>
          )}

          {brandVoice && (
            <Card>
              <CardHeader>
                <CardTitle>Brand Voice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{brandVoice}</div>
              </CardContent>
            </Card>
          )}

          {personas && (
            <Card>
              <CardHeader>
                <CardTitle>Buyer & Negative Personas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{personas}</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}