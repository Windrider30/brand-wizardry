import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

export default function BrandBible() {
  const { toast } = useToast();
  const [brandInfo, setBrandInfo] = useState({
    name: "",
    product: "",
    vibe: "",
    brandStyle: "modern" // modern, traditional, playful, luxury
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here we'll later integrate with ChatGPT to generate the full brand bible
    toast({
      title: "Generating Brand Bible",
      description: "Our AI personas are crafting your comprehensive brand bible...",
    });
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Create Your Brand Bible</h1>
        <p className="text-gray-600">
          Let our AI personas craft a comprehensive brand bible for your business.
          Just provide some basic information to get started.
        </p>
      </div>

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
                placeholder="Describe your main products or services (e.g., Artistic comfort blankets made from premium materials)"
                value={brandInfo.product}
                onChange={(e) => setBrandInfo({ ...brandInfo, product: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vibe">Desired Brand Vibe</Label>
              <Textarea
                id="vibe"
                placeholder="Describe the feeling you want your brand to evoke (e.g., Cozy, artistic, and sustainable luxury for the home)"
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

            <Button type="submit" className="w-full">
              Generate Brand Bible
            </Button>

            <p className="text-sm text-gray-500 text-center">
              Our AI personas (Dr. Brand, Juno, Miss Dodge, and Demeterius) will analyze your input
              and create a comprehensive brand bible including mission statement, target market analysis,
              brand voice, and buyer personas.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}