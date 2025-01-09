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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Error",
          description: "Failed to log out. Please try again.",
          status: "error",
        });
      } else {
        toast({
          title: "Logged out",
          description: "You have been logged out successfully.",
          status: "success",
        });
        setSessionState("unauthenticated");
        navigate("/login");
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        status: "error",
      });
    }
  };

  return (
    <div>
      {sessionState === "authenticated" ? (
        <Button onClick={handleLogout} leftIcon={<LogOut />}>
          Log Out
        </Button>
      ) : (
        <Button onClick={() => navigate("/login")} leftIcon={<LogIn />}>
          Log In
        </Button>
      )}
    </div>
  );
}
