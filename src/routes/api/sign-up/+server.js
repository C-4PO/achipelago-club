import { login, signup } from '$lib/features/accounts/functions.js'

export async function POST({ request, locals: { supabase } }) {
  const { email, password, avatarImage, username } = Object.fromEntries(await request.formData())

  try {
    const { user, error } = await signup(supabase, { email, password, avatarImage, username })
    if (error) {
      throw new Error(error.message)
    }
    if (user) {
      return new Response(JSON.stringify({ user }), { status: 201 })  
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 })  
  }
}