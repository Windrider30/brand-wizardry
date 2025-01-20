import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkAuth = useCallback(async () => {
    if (isChecking) {
      return;
    }

    try {
      setIsChecking(true);
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

        setHasSubscription(!!subscription);
      } else {
        setHasSubscription(false);
      }
    } catch (err) {
      console.error("Unexpected error during auth check:", err);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        await checkAuth();
      }
    });

    // Add visibility change listener with debounce
    let timeoutId: NodeJS.Timeout;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isChecking) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          // Only check if the state is uncertain
          if (isAuthenticated === null) {
            checkAuth();
          }
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timeoutId);
    };
  }, [checkAuth, isChecking, isAuthenticated]);

  return { isAuthenticated, hasSubscription };
}