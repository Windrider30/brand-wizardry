import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

interface AuthButtonsProps {
  isAuthenticated: boolean;
}

export function AuthButtons({ isAuthenticated }: AuthButtonsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if Supabase is initialized correctly
    if (!supabase) {
      console.error("Supabase client is not initialized.");
      toast({
        title: "Configuration Error",
        description: "Supabase client is not properly configured.",
        variant: "destructive",
      });
    }

    // Log authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      // If user is signed out, redirect to login
      if (event === 'SIGNED_OUT') {
        window.location.href = '/login';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    console.log("Logout button clicked."); // Debugging log

    try {
      // First, clear any stored session data
      localStorage.clear();
      sessionStorage.clear();

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error during sign-out:", error);
        throw error;
      }

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