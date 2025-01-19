import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface AuthButtonsProps {
  isAuthenticated: boolean;
}

export function AuthButtons({ isAuthenticated }: AuthButtonsProps) {
  const [sessionState, setSessionState] = useState<"authenticated" | "unauthenticated">(
    isAuthenticated ? "authenticated" : "unauthenticated"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionState(session ? "authenticated" : "unauthenticated");
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setSessionState("unauthenticated");
      } else if (event === 'SIGNED_IN' && session) {
        setSessionState("authenticated");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      
      // Use navigate instead of direct window.location manipulation
      navigate('/login');
      
    } catch (err) {
      console.error("Logout error:", err);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async () => {
    console.log("Login button clicked");
    navigate('/login');
  };

  return (
    <div className="flex items-center space-x-4">
      {sessionState === "authenticated" ? (
        <Button variant="outline" onClick={handleLogout} className="text-lg">
          Logout
        </Button>
      ) : (
        <Button variant="outline" onClick={handleLogin} className="text-lg">
          Login
        </Button>
      )}
    </div>
  );
}