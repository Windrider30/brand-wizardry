import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, MessageSquare, Mail, Tag, Target, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="container py-12">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold">Welcome to Brand Forge Foundry</h1>
        <p className="text-2xl font-semibold text-black">Elevate Your Brand, Elevate Your Sales</p>
        <p className="text-xl text-black max-w-2xl mx-auto">
          Create your brand bible and generate on-brand content using the power of AI
        </p>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6 max-w-6xl mx-auto">
          <div className="p-6 border rounded-lg">
            <BookOpen className="w-12 h-12 text-[#0EA5E9] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-[#0EA5E9]">Brand Bible</h2>
            <p className="text-black text-lg mb-4">Define your brand's voice, values, and vision</p>
            <Link to="/brand-bible">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <Tag className="w-12 h-12 text-[#0EA5E9] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-[#0EA5E9]">Product Descriptions</h2>
            <p className="text-black text-lg mb-4">Generate compelling product content</p>
            <Link to="/product-description">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <MessageSquare className="w-12 h-12 text-[#0EA5E9] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-[#0EA5E9]">Social Posts</h2>
            <p className="text-black text-lg mb-4">Generate content for Facebook, Instagram, and Pinterest</p>
            <Link to="/social-posts">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <Mail className="w-12 h-12 text-[#0EA5E9] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-[#0EA5E9]">Email Content</h2>
            <p className="text-black text-lg mb-4">Create compelling email campaigns</p>
            <Link to="/email-content">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <Target className="w-12 h-12 text-[#0EA5E9] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-[#0EA5E9]">Ad Generation</h2>
            <p className="text-black text-lg mb-4">Create Facebook and Instagram ads</p>
            <Link to="/ad-generation">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <FileText className="w-12 h-12 text-[#0EA5E9] mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-[#0EA5E9]">SEO Articles</h2>
            <p className="text-black text-lg mb-4">Generate optimized content for your blog</p>
            <Link to="/seo-article">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 text-sm text-gray-500">
          Powered by EcomCavalry
        </div>
      </div>
    </div>
  );
};

export default Index;