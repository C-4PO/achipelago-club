import { redirect } from '@sveltejs/kit';
import { getStoryDeck } from '$lib/features/decks/functions';
import { normalizeStoryDeck } from '$lib/features/decks/normalizers';
import { generateLesson } from '$lib/features/lessons/functions';

export async function load({ params, locals: { supabase }, ...rest }) {

  try {
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

    const {
      id,
      title,
      cards
    } = storyDeck;

    // TODO: generate lession function given sides 

    const {
      drawPile,
      stage,
     } = await generateLesson({ deck: storyDeck, prevStage: ``, lessonType: `` })

    return {
      title,
      drawPile,
      cards,
      stage,
      deckId,
    }
  } catch (e) {
    return {
      error: e
    }
  }
}