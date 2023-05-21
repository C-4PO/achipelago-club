import { generateStoryFromPrompt } from '$lib/features/story-generate/functions.js'
import openai from '$lib/features/story-generate/config.js'

export const POST = async ({ request, locals: { supabase, getSession, }}) => {
  const session = await getSession()
  const { user } = session || {}

  let {
    prompt,
    level,
    language,
    tense,
    mood,
  } = await request.json()

  const { data, error } = await generateStoryFromPrompt(openai, { prompt })

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 })
  }

  return new Response(JSON.stringify({ data }), { status: 200 })
}
