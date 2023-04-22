import { serializeNewConcepts } from "$lib/features/concept-review/serializers"

export const POST = async ({ request, locals: { supabase, getSession } }) => {

  let { newConcepts, ...values} = await request.json()

  const serializedConcepts = serializeNewConcepts(newConcepts)

  console.log(JSON.stringify(serializedConcepts, null, 2))

  // check if concept already exists
  // if it does, update it
  // if it exists but is not associated with sentence, associate it with sentence
  // if it doesn't, create it
  return new Response(JSON.stringify({ }), { status: 200 })
}