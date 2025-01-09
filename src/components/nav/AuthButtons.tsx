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
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    console.log("Logout initiated");
    
    try {
      toast({
        title: "Logging out...",
        description: "Please wait while we sign you out.",
      });

      // Clear all browser storage first
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear authentication cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Sign out from Supabase (this should be last)
      await supabase.auth.signOut({ scope: 'global' });
      
      // Redirect to login page after successful logout
      window.location.href = '/login';
      
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