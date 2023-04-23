import { getDeck, getDeckConcepts, getReviews } from '$lib/features/concept-review/functions'
import { normalizeDeck, normalizeRelatedConceptsInDeck, normalizeReviewInDeck } from '$lib/features/concept-review/normalizers'
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
    userId: user.id,
    sentenceIds: deck.cards.map(card => card.sentenceId),
  })

  if (relatedConceptError) {
    console.error(relatedConceptError)
    return { error: relatedConceptError }
  }

  deck = normalizeRelatedConceptsInDeck({ deck, relatedConceptData })

  const { data: reviewData = {}, error: reviewError } = await getReviews(supabase, { deckId: params.id })

  if (reviewError) {
    console.error(reviewError)
    return { error: reviewError }
  }

  deck = normalizeReviewInDeck({ deck, reviewData })

  return { deck };
}