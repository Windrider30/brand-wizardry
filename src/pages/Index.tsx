import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, MessageSquare, Mail, Tag, Target } from "lucide-react";

const Index = () => {
  return (
    <div className="container py-12">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-primary">Welcome to BrandAI</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Create your brand bible and generate on-brand content using the power of AI
        </p>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 max-w-6xl mx-auto">
          <div className="p-6 border rounded-lg">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Brand Bible</h2>
            <p className="text-gray-600 mb-4">Define your brand's voice, values, and vision</p>
            <Link to="/brand-bible">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <Tag className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Product Descriptions</h2>
            <p className="text-gray-600 mb-4">Generate compelling product content</p>
            <Link to="/product-description">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Social Posts</h2>
            <p className="text-gray-600 mb-4">Generate content for Facebook, Instagram, and Pinterest</p>
            <Link to="/social-posts">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Email Content</h2>
            <p className="text-gray-600 mb-4">Create compelling email campaigns</p>
            <Link to="/email-content">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>

          <div className="p-6 border rounded-lg">
            <Target className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Ad Generation</h2>
            <p className="text-gray-600 mb-4">Create Facebook and Instagram ads</p>
            <Link to="/ad-generation">
              <Button variant="outline" className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;