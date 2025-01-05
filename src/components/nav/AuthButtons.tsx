import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "../ui/use-toast";

interface AuthButtonsProps {
  isAuthenticated: boolean;
}

export function AuthButtons({ isAuthenticated }: AuthButtonsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // First, sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Show success toast
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });

      // Force a complete reload and redirect
      setTimeout(() => {
        window.location.replace('/login');
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
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