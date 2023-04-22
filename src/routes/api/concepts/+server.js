import { saveConcepts } from '$lib/features/story-review/functions'

export const POST = async ({ request, locals: { supabase, getSession } }) => {
  const session = await getSession()
  const { user } = session || {}
  
  let { concepts, deckId, sentenceId } = await request.json()


  const { data, error } = await saveConcepts(supabase, {
    concepts,
    userId: user.id,
    deckId,
    sentenceId,
  })

  if (error) {
    console.error(error)
    return new Response(JSON.stringify({ error }), { status: 500 })
  }

  return new Response(JSON.stringify({ }), { status: 200 })
}


