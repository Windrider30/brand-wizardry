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
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Initial session check:", session);
      setSessionState(session ? "authenticated" : "unauthenticated");
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      setSessionState(session ? "authenticated" : "unauthenticated");
      
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, redirecting to login");
        navigate('/login', { replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    console.log("Logout initiated");
    
    try {
      // First, kill the session on the Supabase side
      const { error: signOutError } = await supabase.auth.signOut({
        scope: 'global'  // Changed from 'local' to 'global' to ensure complete signout
      });

      if (signOutError) {
        throw signOutError;
      }

      // Clear all browser storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Force clear any cached auth state
      await supabase.auth.clearSession();
      
      // Double check session is cleared
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Session after logout attempt:", session);
      
      if (!session) {
        console.log("Session successfully cleared");
        toast({
          title: "Logged out successfully",
          description: "You have been logged out.",
        });
        
        // Force navigation to login page with replace to prevent back navigation
        window.location.href = '/login';  // Using window.location for complete page refresh
      } else {
        throw new Error("Failed to clear session");
      }
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
    console.log("Login button clicked");
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