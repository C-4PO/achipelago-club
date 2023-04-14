import { supabase } from '$lib/features/supabase/config.js'
import { login, signup } from '$lib/features/accounts/functions.js'
import { redirect } from '@sveltejs/kit';

export async function POST({ request }) {
  const { email, password } = request.body;

  const { error: signedUpError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signedUpError) {
    return {
      status: 400,
      body: JSON.stringify({ message: error.message }),
    };
  }


  // login using supabase
  const { user: loggedInUser, error: loginError } = await supabase.auth.signIn({
    email,
    password,
  })

  if (loggedInUser) {
    throw redirect(302, '/story-list')
  }
}