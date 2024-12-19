import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function BrandBible() {
  const { toast } = useToast();
  const [brandInfo, setBrandInfo] = useState({
    name: "",
    mission: "",
    values: "",
    voice: "",
    audience: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Brand Bible Saved",
      description: "Your brand information has been saved successfully.",
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Create Your Brand Bible</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Brand Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Brand Name</label>
                <Input
                  value={brandInfo.name}
                  onChange={(e) => setBrandInfo({ ...brandInfo, name: e.target.value })}
                  placeholder="Enter your brand name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Mission Statement</label>
                <Textarea
                  value={brandInfo.mission}
                  onChange={(e) => setBrandInfo({ ...brandInfo, mission: e.target.value })}
                  placeholder="What is your brand's mission?"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand Voice & Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Core Values</label>
                <Textarea
                  value={brandInfo.values}
                  onChange={(e) => setBrandInfo({ ...brandInfo, values: e.target.value })}
                  placeholder="What are your brand's core values?"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Brand Voice</label>
                <Textarea
                  value={brandInfo.voice}
                  onChange={(e) => setBrandInfo({ ...brandInfo, voice: e.target.value })}
                  placeholder="Describe your brand's voice and tone"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button type="submit" className="w-full md:w-auto">
            Save Brand Bible
          </Button>
        </div>
      </form>
    </div>
  );
}