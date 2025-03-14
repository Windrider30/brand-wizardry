import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define price IDs for different tiers and durations
const PRICE_IDS = {
  beginner: {
    monthly: 'price_1QYafILRjAwduTkvPkjXCk7w',
    quarterly: 'price_1QYagaLRjAwduTkvcgC3Wlmo',
    yearly: 'price_1QYahnLRjAwduTkveEalkYJA'
  },
  professional: {
    monthly: 'price_1QYainLRjAwduTkvLC752ARg',
    quarterly: 'price_1QYajcLRjAwduTkvGHt7Hi2J',
    yearly: 'price_1QYakPLRjAwduTkvJr89VdyC'
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the user from the token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.error('Invalid user token:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid user token' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the tier and duration from the request
    const { tier, duration, returnUrl } = await req.json();
    console.log('Received request for tier:', tier, 'duration:', duration);
    
    if (!tier || !duration) {
      console.error('Missing tier or duration');
      return new Response(
        JSON.stringify({ error: 'Tier and duration are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    console.log('Stripe key exists:', !!stripeKey);

    if (!stripeKey) {
      console.error('Stripe secret key not found in environment');
      return new Response(
        JSON.stringify({ error: 'Stripe configuration error' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Get the appropriate price ID
    const priceId = PRICE_IDS[tier]?.[duration];
    if (!priceId) {
      return new Response(
        JSON.stringify({ error: 'Invalid tier or duration' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    console.log('Creating checkout session...');
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/dashboard?success=true`,
      cancel_url: `${req.headers.get('origin')}/?canceled=true`,
      metadata: {
        user_id: user.id,
        tier,
        duration
      }
    });

    console.log('Checkout session created:', session.id);
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});