import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Mail, Target, Tag, FileText, LogOut, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";

export function MainNav() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold">Brand Forge Foundry</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4 overflow-x-auto">
          {isAuthenticated && (
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
              <a href="mailto:support@brandforgefoundry.com.au" className="ml-4">
                <Button variant="ghost" className="text-lg flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Support
                </Button>
              </a>
            </>
          )}
          {isAuthenticated ? (
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="text-lg flex items-center gap-2"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          ) : (
            <Button 
              onClick={handleLogin} 
              variant="outline" 
              className="text-lg flex items-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}