import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastCheckTime, setLastCheckTime] = useState<number>(0);

  const checkAuth = useCallback(async () => {
    const now = Date.now();
    if (isChecking || (now - lastCheckTime < 5000)) {
      return;
    }

    try {
      setIsChecking(true);
      setLastCheckTime(now);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session check error:", sessionError);
        return;
      }

      if (session?.user) {
        setIsAuthenticated(true);
        try {
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
        } catch (err) {
          console.error("Subscription check error:", err);
        }
      } else {
        setIsAuthenticated(false);
        setHasSubscription(false);
      }
    } catch (err) {
      console.error("Auth check error:", err);
    } finally {
      setIsChecking(false);
    }
  }, [lastCheckTime, isChecking]);

  useEffect(() => {
    // Only do initial auth check if we don't know the auth state
    if (isAuthenticated === null) {
      checkAuth();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        checkAuth();
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setHasSubscription(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth, isAuthenticated]);

  return { isAuthenticated, hasSubscription };
}