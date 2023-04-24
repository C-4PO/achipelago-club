import { getDeck, buildConceptCards } from '$lib/features/concept-review/functions'
import {
  normalizeDeck,
  normalizeRelatedConceptsInConceptCards,
  normalizeReviewInConceptCards
} from '$lib/features/concept-review/normalizers'
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

  const {
    data: cards
  } = await buildConceptCards(supabase, {
    cards: deck.cards,
    deckId: params.id,
    userId: user.id
  })

  console.log('cards', cards)

  deck.cards = cards
  return { deck };
}