import { getDeck, getDeckConcepts } from '$lib/features/concept-review/features'
import { normalizeDeck, normalizeRelatedConceptsInDeck } from '$lib/features/concept-review/normalizers'
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

  let deck = normalizeDeck({ deckData })

  const { data: relatedConceptData = {}, error: relatedConceptError } = await getDeckConcepts(supabase, {
    deckId: params.id,
    userId: user.id,
    sentenceIds: deck.cards.map(card => card.sentenceId),
  })

  deck = normalizeRelatedConceptsInDeck({ deck, relatedConceptData })
  
  return { deck };
}