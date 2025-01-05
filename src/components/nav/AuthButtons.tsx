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

  // Debugging and Authentication State Listener
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === "SIGNED_OUT") {
        console.log("User has signed out.");
        // Optionally, update the parent component's state if necessary
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Initiating logout...");
      
      // Call Supabase's signOut method
      const { error } = await supabase.auth.signOut();
      console.log("Logout response:", error);

      if (error) {
        console.error("Supabase signOut error:", error);
        throw error;
      }

      // Clear any stored session data
      localStorage.clear();
      console.log("Local storage cleared.");

      // Show success toast
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });

      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout error:", error);

      // Show error toast
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    console.log("Navigating to login...");
    navigate('/login');
  };

  if (isAuthenticated) {
    return (
      <Button 
        onClick={handleLogout} 
        variant="outline" 
        className="text-lg flex items-center gap-2"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleLogin} 
      variant="outline" 
      className="text-lg flex items-center gap-2"
    >
      <LogIn className="h-5 w-5" />
      Login
    </Button>
  );
}
