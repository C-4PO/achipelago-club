import { getDeck } from '$lib/features/concept-review/features'
import { normalizeDeck } from '$lib/features/concept-review/normalizers'
import { redirect } from '@sveltejs/kit';

export async function load({ params, parent }) {
  const { supabase, session } = await parent()
  const user = session.user

  if (!session) {
    throw redirect(303, '/')
  }

  const { data: deckData = {}, error } = await getDeck(supabase, { deckId: params.id, userId: user.id })

  if (error) {
    console.error(error)
    return { error }
  }

  const deck = normalizeDeck({ deckData })
  // const cards = normalizeSentenceCards({ concept: normalizedConcept })
  
  return { deck };
}