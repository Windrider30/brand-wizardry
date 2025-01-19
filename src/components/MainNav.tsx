import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { NavLinks } from "./nav/NavLinks";
import { AuthButtons } from "./nav/AuthButtons";
import { SupportButton } from "./nav/SupportButton";
import { toast } from "@/components/ui/use-toast";

export function MainNav() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking auth state...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth check error:", error);
          toast({
            title: "Authentication Error",
            description: "There was an error checking your authentication status. Please try logging in again.",
            variant: "destructive",
          });
          return;
        }

        console.log("Session state:", !!session);
        setIsAuthenticated(!!session);

        if (session) {
          const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .maybeSingle();

          if (subError) {
            console.error("Subscription check error:", subError);
            return;
          }

          console.log("Subscription state:", !!subscription);
          setHasSubscription(!!subscription);
        }
      } catch (err) {
        console.error("Unexpected error during auth check:", err);
      }
    };

    // Check immediately on component mount
    checkAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, !!session);
      setIsAuthenticated(!!session);
      
      if (session) {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .maybeSingle();

        setHasSubscription(!!subscription);
      } else {
        setHasSubscription(false);
      }
    });

    // Add visibility change listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Tab became visible, rechecking auth...");
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold">Brand Forge Foundry</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4 overflow-x-auto">
          <NavLinks hasSubscription={hasSubscription} />
          <SupportButton hasSubscription={hasSubscription} />
          <AuthButtons isAuthenticated={!!isAuthenticated} />
        </div>
      </div>
    </nav>
  );
}