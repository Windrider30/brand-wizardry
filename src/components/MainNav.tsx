import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function MainNav() {
  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">BrandAI</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <Link to="/brand-bible">
            <Button variant="ghost">Brand Bible</Button>
          </Link>
          <Link to="/generate">
            <Button variant="ghost">Generate Content</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}