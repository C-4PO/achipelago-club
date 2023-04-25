import { saveConcepts } from '$lib/features/story-review/functions'
import { serializeNewConcepts } from "$lib/features/concept-review/serializers"
import {
  addConcepts,
} from "$lib/features/concept-review/functions"

export const POST = async ({ request, locals: { supabase, getSession } }) => {
  const session = await getSession()
  const { user } = session || {}
  
  let { newConcepts, deckId } = await request.json()
  const serializedConcepts = serializeNewConcepts(newConcepts)

  if (newConcepts.length) {
    const conceptResponses = await addConcepts(supabase, {
      concepts: serializedConcepts,
      userId: user.id,
      deckId: deckId
    })
  
    if (conceptResponses.some(({ error }) => error)) {
      return new Response(JSON.stringify({ errors: conceptResponses }), { status: 500 })
    }
  }
  return new Response(JSON.stringify({ }), { status: 200 })
}


