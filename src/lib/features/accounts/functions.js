import { supabase } from '$lib/features/supabase/config.js'

export const signup = async ({ email, password }) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  })

  return { user, error }
}

export const login = async ({ email, password }) => {
  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  })

  return { user, error }
}