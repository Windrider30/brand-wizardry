import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CancelSubscription = () => {
  const { toast } = useToast();

  const handleCancelSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to cancel your subscription",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke('cancel-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Success",
        description: "Your subscription has been cancelled successfully",
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-8">
      <Button
        variant="outline"
        className="text-red-500 hover:text-red-600 border-red-500 hover:border-red-600"
        onClick={handleCancelSubscription}
      >
        Cancel Subscription
      </Button>
      <p className="text-sm text-gray-500 mt-2">
        No lock-in contracts. Cancel anytime.
      </p>
    </div>
  );
};