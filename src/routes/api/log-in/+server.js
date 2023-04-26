import { login } from '$lib/features/accounts/functions.js'

export async function POST({ request, locals: { supabase } }) {
  const { email, password } = await request.json()

  try {
    const { data, error } = await login(supabase, { email, password })
   
    if (error) {
      console.error({ error })
      return new Response(JSON.stringify({ error }), { status: 500 })
    }
    
    return new Response(JSON.stringify({ data }), { status: 200  })  
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 })  
  }
}