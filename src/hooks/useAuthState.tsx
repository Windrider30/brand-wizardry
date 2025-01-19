import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkAuth = useCallback(async () => {
    // Prevent concurrent checks
    if (isChecking) {
      console.log("Auth check already in progress");
      return;
    }

    try {
      setIsChecking(true);
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
      } else {
        setHasSubscription(false);
      }
    } catch (err) {
      console.error("Unexpected error during auth check:", err);
    } finally {
      setIsChecking(false);
    }
  }, [isChecking]);

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, !!session);
      
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        await checkAuth();
      }
    });

    // Add visibility change listener with debounce
    let timeoutId: NodeJS.Timeout;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Tab became visible, scheduling auth check...");
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkAuth, 1000); // Reduced debounce time to 1 second
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timeoutId);
    };
  }, [checkAuth]);

  return { isAuthenticated, hasSubscription };
}