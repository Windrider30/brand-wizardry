import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

interface AuthButtonsProps {
  isAuthenticated: boolean;
}

export function AuthButtons({ isAuthenticated }: AuthButtonsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessionState, setSessionState] = useState<string>("checking");

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Initial session check:", session);
      setSessionState(session ? "authenticated" : "unauthenticated");
    };
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      setSessionState(session ? "authenticated" : "unauthenticated");
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to login");
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    console.log("Logout button clicked.");
    
    try {
      // Check session before logout
      const { data: sessionBefore } = await supabase.auth.getSession();
      console.log("Session before logout:", sessionBefore);

      // Clear storage first
      localStorage.clear();
      sessionStorage.clear();

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign-out:", error);
        throw error;
      }

      // Verify session is cleared
      const { data: sessionAfter } = await supabase.auth.getSession();
      console.log("Session after logout:", sessionAfter);

      console.log("User successfully signed out.");

      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
      });

    } catch (err) {
      console.error("Logout error:", err);

      toast({
        title: "Error logging out",
        description: "An issue occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    console.log("Login button clicked.");
    navigate('/login');
  };

  return (
    <>
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
    </>
  );
}