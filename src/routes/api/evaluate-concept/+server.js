import { serializeNewConcepts } from "$lib/features/concept-review/serializers"
import { addConcepts } from "$lib/features/concept-review/functions"

export const POST = async ({ request, locals: { supabase, getSession } }) => {
  let { newConcepts, deckId} = await request.json()
  const serializedConcepts = serializeNewConcepts(newConcepts)
  try {
    const { user } = await getSession()
    const conceptResponses = await addConcepts(supabase, {
      concepts: serializedConcepts,
      userId: user.id,
      deckId: deckId
    })

    if (conceptResponses.some(({ error }) => error)) {
      return new Response(JSON.stringify({ error: 'Error adding concepts' }), { status: 500 })
    }

    

    return new Response(JSON.stringify({ }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  } 
}