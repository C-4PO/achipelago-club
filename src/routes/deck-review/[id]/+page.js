import { getDeck, buildConceptCards } from '$lib/features/concept-review/functions'
import { summerizeCards } from '$lib/features/concept-review/utilities'
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

  deck.cards = cards
  deck.summary = summerizeCards(deck)
  return { deck };
}