import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  try {
    // Get the session or user object
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data } = await supabaseClient.auth.getUser(token)
    const user = data.user
    const email = user?.email

    if (!email) {
      throw new Error('No email found')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Get customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1
    })

    if (customers.data.length === 0) {
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          tier: null,
          duration: null
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
      limit: 1,
      expand: ['data.items.data.price']
    })

    if (subscriptions.data.length === 0) {
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          tier: null,
          duration: null
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Get the price ID from the subscription
    const priceId = subscriptions.data[0].items.data[0].price.id

    // Determine tier and duration from price ID
    let tier = null
    let duration = null

    // Check professional tier prices
    if (priceId === 'price_1QYakPLRjAwduTkvJr89VdyC') {
      tier = 'professional'
      duration = 'yearly'
    } else if (priceId === 'price_1QYajcLRjAwduTkvGHt7Hi2J') {
      tier = 'professional'
      duration = 'quarterly'
    } else if (priceId === 'price_1QYainLRjAwduTkvLC752ARg') {
      tier = 'professional'
      duration = 'monthly'
    }
    // Check beginner tier prices
    else if (priceId === 'price_1QYahnLRjAwduTkveEalkYJA') {
      tier = 'beginner'
      duration = 'yearly'
    } else if (priceId === 'price_1QYagaLRjAwduTkvcgC3Wlmo') {
      tier = 'beginner'
      duration = 'quarterly'
    } else if (priceId === 'price_1QYafILRjAwduTkvPkjXCk7w') {
      tier = 'beginner'
      duration = 'monthly'
    }

    return new Response(
      JSON.stringify({ 
        subscribed: true,
        tier,
        duration
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error checking subscription:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})