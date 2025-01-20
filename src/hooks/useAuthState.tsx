import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export function useAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastCheckTime, setLastCheckTime] = useState<number>(0);

  const checkAuth = useCallback(async () => {
    // Prevent checks more frequent than every 5 seconds
    const now = Date.now();
    if (isChecking || (now - lastCheckTime < 5000)) {
      return;
    }

    try {
      setIsChecking(true);
      setLastCheckTime(now);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setIsAuthenticated(false);
        setHasSubscription(false);
        return;
      }

      setIsAuthenticated(!!session);

      if (session) {
        try {
          const { data: subscription, error: subError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .maybeSingle();

          if (subError) {
            console.error("Subscription check error:", subError);
            // Don't update subscription state on error to prevent flashing
            return;
          }

          setHasSubscription(!!subscription);
        } catch (err) {
          console.error("Unexpected error during subscription check:", err);
          // Don't update subscription state on error
        }
      } else {
        setHasSubscription(false);
      }
    } catch (err) {
      console.error("Unexpected error during auth check:", err);
      setIsAuthenticated(false);
      setHasSubscription(false);
    } finally {
      setIsChecking(false);
    }
  }, [lastCheckTime, isChecking]);

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

    // Only check auth on visibility change if we're not sure about the auth state
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Preserve the current auth state when tabbing back
        // Only check if we're really unsure about the auth state
        if (isAuthenticated === null) {
          checkAuth();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkAuth, isAuthenticated]);

  return { isAuthenticated, hasSubscription };
}