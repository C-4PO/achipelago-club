import { getStoryDeck } from '$lib/features/decks/functions';
import { normalizeStoryDeck } from '$lib/features/decks/normalizers';
import { generateLesson } from '$lib/features/lessons/functions';

export const GET = async ({ request, url, locals: { supabase, getSession }}) => {
  debugger
  const session = await getSession()
  const { user } = session || {}

  const deckId = Number(url.searchParams.get('deckId'))
  const lessonType = url.searchParams.get('lessonType')
  const prevStage = url.searchParams.get('stage') || ``

  try {
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
      drawPile,
      stage,
    } = await generateLesson({ deck: storyDeck, prevStage, lessonType })

    return new Response(JSON.stringify({
      stage,
      drawPile,
    }), { status: 200 })
  } catch (error) {
    console.error(`error`, error)
    return new Response(JSON.stringify({ error }), { status: 500 })
  }
}
