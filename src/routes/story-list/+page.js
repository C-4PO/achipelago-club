import { getDecks } from '$lib/features/decks/functions.js';
import { normalizeShallowDeck } from '$lib/features/decks/normalizers.js';
import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
  const { supabase, session } = await parent()

  if (!session) {
    throw redirect(303, '/');
  }
  
  const { data: decks, error: storyDeckError } = await getDecks(supabase, { userId: session.user.id })

  if (storyDeckError) {
    return { error: storyDeckError }
  }

  const { data: normalizedDecks } = normalizeShallowDeck({ decks })

  const { reviewDecks, storyDecks } = normalizedDecks.reduce((acc, deck) => {
    if (deck.type === 'REVIEW') {
      acc.reviewDecks.push(deck)
    } else if (deck.type === 'STORY') {
      if ((deck.reviewSummary.totalCardsDue > 0 || deck.reviewSummary.totalCardsOverdue) > 0 || deck.reviewSummary.totalNewCards > 0) {
        acc.storyDecks.push(deck)
      }
    }
    return acc
  }, { reviewDecks: [], storyDecks: [] })

  return { reviewDecks, storyDecks  };
}