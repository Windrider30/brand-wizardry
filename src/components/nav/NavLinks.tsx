import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Target, Tag, FileText, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

interface NavLinksProps {
  hasSubscription: boolean;
}

export function NavLinks({ hasSubscription }: NavLinksProps) {
  if (!hasSubscription) return null;

  return (
    <>
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
    </>
  );
}