import { redirect } from '@sveltejs/kit';
import { getStoryDeck } from '$lib/features/decks/functions';
import { normalizeStoryDeck } from '$lib/features/decks/normalizers';
import { generateLesson } from '$lib/features/lessons/functions';

export async function load({ params, locals: { supabase }, ...rest }) {
  // const { user } = await getSession()

  const {
    id: deckId,
  }  = params

  // if (!user) {
  //   throw redirect(303, '/')
  // }

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

  const lesson = await generateLesson({
    sides: [
      {type: `ReadListen`},
      {type: `ReadListenGraded`},
      {type: `ReadTranslate`},
      {type: `ReadTranslateGraded`},
    ],
    deck: storyDeck,
  })

  return {
    title,
    lesson,
    cards,
  }
}