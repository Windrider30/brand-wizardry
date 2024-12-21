import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, MessageSquare, Mail, Tag, Target, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="text-center space-y-4 md:space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold">Welcome to Brand Forge Foundry</h1>
        <p className="text-xl md:text-2xl font-semibold text-black">Elevate Your Brand, Elevate Your Sales</p>
        <p className="text-lg md:text-xl text-black max-w-2xl mx-auto">
          Create your brand bible and generate on-brand content using the power of AI
        </p>
        
        <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 max-w-6xl mx-auto mt-8">
          <div className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-[#0EA5E9] mx-auto mb-3 md:mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#0EA5E9]">Brand Bible</h2>
            <p className="text-base md:text-lg text-black mb-4">Define your brand's voice, values, and vision</p>
            <Link to="/brand-bible" className="block">
              <Button variant="outline" className="w-full text-base md:text-lg border-black">Get Started</Button>
            </Link>
          </div>

          <div className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Tag className="w-8 h-8 md:w-12 md:h-12 text-[#0EA5E9] mx-auto mb-3 md:mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#0EA5E9]">Product Descriptions</h2>
            <p className="text-base md:text-lg text-black mb-4">Generate compelling product content</p>
            <Link to="/product-description" className="block">
              <Button variant="outline" className="w-full text-base md:text-lg border-black">Get Started</Button>
            </Link>
          </div>

          <div className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <MessageSquare className="w-8 h-8 md:w-12 md:h-12 text-[#0EA5E9] mx-auto mb-3 md:mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#0EA5E9]">Social Posts</h2>
            <p className="text-base md:text-lg text-black mb-4">Generate content for Facebook, Instagram, and Pinterest</p>
            <Link to="/social-posts" className="block">
              <Button variant="outline" className="w-full text-base md:text-lg border-black">Get Started</Button>
            </Link>
          </div>

          <div className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Mail className="w-8 h-8 md:w-12 md:h-12 text-[#0EA5E9] mx-auto mb-3 md:mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#0EA5E9]">Email Content</h2>
            <p className="text-base md:text-lg text-black mb-4">Create compelling email campaigns</p>
            <Link to="/email-content" className="block">
              <Button variant="outline" className="w-full text-base md:text-lg border-black">Get Started</Button>
            </Link>
          </div>

          <div className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Target className="w-8 h-8 md:w-12 md:h-12 text-[#0EA5E9] mx-auto mb-3 md:mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#0EA5E9]">Ad Generation</h2>
            <p className="text-base md:text-lg text-black mb-4">Create Facebook and Instagram ads</p>
            <Link to="/ad-generation" className="block">
              <Button variant="outline" className="w-full text-base md:text-lg border-black">Get Started</Button>
            </Link>
          </div>

          <div className="p-4 md:p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <FileText className="w-8 h-8 md:w-12 md:h-12 text-[#0EA5E9] mx-auto mb-3 md:mb-4" />
            <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#0EA5E9]">SEO Articles</h2>
            <p className="text-base md:text-lg text-black mb-4">Generate optimized content for your blog</p>
            <Link to="/seo-article" className="block">
              <Button variant="outline" className="w-full text-base md:text-lg border-black">Get Started</Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 md:mt-16 text-xs md:text-sm text-gray-500">
          Powered by EcomCavalry
        </div>
      </div>
    </div>
  );
};

export default Index;