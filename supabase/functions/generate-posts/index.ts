import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY') || '';

serve(async (req) => {
  try {
    // Create authenticated Supabase client
    const supabaseClient = createClient(
      Deno.env.get('APP_SUPABASE_URL') ?? '',
      Deno.env.get('APP_SUPABASE_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } }
      }
    )

    // Get the user from JWT
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Check user quota
    const { data: quotaData, error: quotaError } = await supabaseClient
      .from('user_quotas')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (quotaError || !quotaData) throw new Error('Quota check failed')

    // Check API call limits
    const today = new Date().toISOString().split('T')[0]
    if (quotaData.api_calls_today >= 100 && quotaData.last_api_call_date === today) {
      throw new Error('Daily API limit reached')
    }

    // Parse request body
    const { description, tone, audience } = await req.json()
    if (!description || !tone || !audience) {
      throw new Error('Missing required fields')
    }

    // Call DeepSeek API via OpenRouter
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://postmint.ai',
        'X-Title': 'PostMint AI'
      },
      body: JSON.stringify({
        model: 'deepseek-ai/deepseek-llm-67b-chat',
        messages: [
          {
            role: 'system',
            content: `You are a marketing post generator for X platform. Generate 35 engaging posts based on the user's business description. 
            The posts should be optimized for engagement and follow the specified tone and target audience. 
            Format each post clearly and ensure they're varied in style (questions, statements, CTAs, etc.).`
          },
          {
            role: 'user',
            content: `Business description: ${description}\nTone: ${tone}\nTarget audience: ${audience}\n\nGenerate 35 marketing posts.`
          }
        ],
        max_tokens: 4000
      })
    })

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.json()
      throw new Error(`API call failed: ${JSON.stringify(errorData)}`)
    }

    const openRouterData = await openRouterResponse.json()
    const completion = openRouterData.choices[0].message.content

    // Parse the completion into individual posts
    const posts = parsePostsFromCompletion(completion)

    // Update user quota in database
    const { error: updateError } = await supabaseClient
      .from('user_quotas')
      .update({ 
        remaining_submits: quotaData.remaining_submits - 1,
        api_calls_today: quotaData.api_calls_today + 1,
        last_api_call_date: today,
        cached_posts: posts
      })
      .eq('user_id', user.id)

    if (updateError) throw new Error('Failed to update quota')

    return new Response(JSON.stringify({ posts }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

function parsePostsFromCompletion(completion: string): string[] {
  // Try to parse numbered posts first
  const postRegex = /\d+\.\s*(.+?)(?=\n\d+\.|\n*$)/gs
  const posts = []
  let match
  
  while ((match = postRegex.exec(completion)) !== null) {
    posts.push(match[1].trim())
  }

  // Fallback to splitting by double newlines if no numbered posts found
  if (posts.length === 0) {
    return completion.split('\n\n').filter(post => post.trim().length > 0)
  }

  return posts.slice(0, 35) // Ensure we don't exceed 35 posts
}