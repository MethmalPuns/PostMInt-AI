import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const lemonSqueezySecret = Deno.env.get('LEMON_SQUEEZY_SECRET') || '';

async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder()
  const key = encoder.encode(secret)
  const data = encoder.encode(payload)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )

  const sigBuffer = Uint8Array.from(atob(signature), c => c.charCodeAt(0))

  return await crypto.subtle.verify('HMAC', cryptoKey, sigBuffer, data)
}
 
serve(async (req) => {
  try {
    // Verify webhook signature
    const body = await req.text()
    const signature = req.headers.get('X-Signature') || ''
    const isValid = await verifySignature(body, signature, lemonSqueezySecret)
    if (!isValid) throw new Error('Invalid signature')

    const payload = JSON.parse(body)
    if (payload.meta.event_name !== 'order_created') {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const customData = payload.data.attributes.custom_data || {}
    if (!customData.user_id || !customData.addon_type) {
      throw new Error('Missing user ID or addon type')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('APP_SUPABASE_URL') ?? '',
      Deno.env.get('APP_SUPABASE_KEY') ?? ''
    )

    // Process based on addon type
   if (customData.addon_type === 'more_posts') {
  const { data: postCount, error: rpcError } = await supabaseClient
    .rpc('increment_user_quota', {
      user_id: customData.user_id,
      column_name: 'purchased_posts',
      value: 10
    })

  if (rpcError) throw rpcError
} else if (customData.addon_type === 'new_input') {
  const { data: submitCount, error: rpcError } = await supabaseClient
    .rpc('increment_user_quota', {
      user_id: customData.user_id,
      column_name: 'purchased_submits',
      value: 1
    })

  if (rpcError) throw rpcError
}


    // Record purchase
    await supabaseClient
      .from('purchases')
      .insert([{
        user_id: customData.user_id,
        product_id: payload.data.attributes.product_id,
        variant_id: payload.data.attributes.variant_id,
        order_id: payload.data.attributes.order_id,
        addon_type: customData.addon_type,
        amount: payload.data.attributes.total_usd,
        currency: 'USD',
        status: 'completed'
      }])

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})