import { Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface PricingFeature {
  name: string;
  limit: number;
}

interface PricingCardProps {
  title: string;
  price: string;
  features: PricingFeature[];
  tier: 'beginner' | 'professional';
  duration: 'monthly' | 'quarterly' | 'yearly';
}

export function PricingCard({ title, price, features, tier, duration }: PricingCardProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const getBillingPeriod = () => {
    switch (duration) {
      case 'quarterly':
        return '/quarter';
      case 'yearly':
        return '/year';
      default:
        return '/month';
    }
  };

  const handleSubscribe = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to subscribe to a plan",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      console.log('Creating checkout session for:', { tier, duration });
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          tier, 
          duration,
          returnUrl: window.location.origin
        }
      });

      if (error) {
        console.error('Checkout error:', error);
        throw error;
      }

      if (!data?.url) {
        throw new Error('No checkout URL received');
      }

      console.log('Redirecting to checkout URL:', data.url);
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
        <div className="text-center">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground">{getBillingPeriod()}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#0EA5E9]" />
              <span>
                {feature.limit} {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-[#0EA5E9] hover:bg-[#0284C7]" 
          onClick={handleSubscribe}
        >
          Subscribe Now
        </Button>
      </CardFooter>
    </Card>
  );
}