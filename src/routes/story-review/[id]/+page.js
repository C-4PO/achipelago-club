import { redirect } from '@sveltejs/kit';
import { getStoryDeck } from '$lib/features/decks/functions';
import { normalizeStoryDeck } from '$lib/features/decks/normalizers';

export async function load({ params, parent }) {
  const { supabase, session } = await parent()

  const {
    id: deckId,
  }  = params

  if (!session) {
    throw redirect(303, '/')
  }

  const { data: dbStoryDeck, error: dbStoryDeckError } = await getStoryDeck(supabase, {
    deckId,
  })

  if (dbStoryDeckError) {
    return {
      error: dbStoryDeckError,
      type: `Storty Deck Fetch Error`
    }
  }

  const { data: storyDeck, error: storyDeckError } = normalizeStoryDeck({
    dbStoryDeck,
  })

  if (storyDeckError) {
    return {
      error: storyDeckError,
      type: `Story Deck Parse Error`,
    }
  }

  // apply text to speech

  const {
    id,
    title,
    cards
  } = storyDeck;

  // TODO: generate lession function given sides 

  const lesson = [
    ...cards.map(card => ({
      card,
      stage: `read`,
      gradeWeight: 1,
      sides: [{type: `ReadListen`}, {type: `ReadListen`}, {type: `ReadListen`}],
    })),
  ]

  return {
    title,
    lesson,
  }
}