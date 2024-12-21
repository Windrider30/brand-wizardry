import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Mail, Target, Tag, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function MainNav() {
  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold">Brand Forge Foundry</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4 overflow-x-auto">
          <Link to="/brand-bible">
            <Button variant="ghost" className="text-lg">Brand Bible</Button>
          </Link>
          <Link to="/social-posts">
            <Button variant="ghost" className="text-lg">Social Posts</Button>
          </Link>
          <Link to="/product-description">
            <Button variant="ghost" className="text-lg">Product Description</Button>
          </Link>
          <Link to="/email-content">
            <Button variant="ghost" className="text-lg">Email Content</Button>
          </Link>
          <Link to="/ad-generation">
            <Button variant="ghost" className="text-lg">Ad Generation</Button>
          </Link>
          <Link to="/seo-article">
            <Button variant="ghost" className="text-lg">SEO Articles</Button>
          </Link>
          <a href="mailto:support@brandforgefoundry.com.au" className="ml-4">
            <Button variant="ghost" className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Support
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
}