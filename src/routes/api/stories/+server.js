import isEmpty from 'lodash/isEmpty.js'

import { translate } from '$lib/features/text-to-speech/functions.js'
import { createSentences } from '$lib/features/sentences/functions.js'
import { serializeSentences } from '$lib/features/sentences/serializers.js'
import { createDeck, associateCardsToDeck } from '$lib/features/decks/functions.js'
import { createSentenceCards } from '$lib/features/cards/functions.js'
import { createCardsReviews } from '$lib/features/reviews/functions.js'

export const POST = async ({ request, locals: { supabase, getSession }}) => {
  debugger
  const session = await getSession()
  const { user } = session || {}

  try {
    if (!user) {
      console.error(`You must be logged in to create a story.`)
      return new Response(JSON.stringify({ error: `You must be logged in to create a story.` }), { status: 401 })
    }

    let {
      title,
      originalStory,
    } = await request.json()

    let { data: translatedStory, ...translationError } = await translate({ text: originalStory, target: `en`  })

    if (!isEmpty(translationError)) {
      console.error(`translationError`, translationError)
      return new Response(JSON.stringify({ ...translationError }), { status: 500 })
    }

    const { data: serializedSentences } = serializeSentences({ originalStory, translatedStory })

    const { data: createdDeck, ...createdDeckError } = await createDeck(supabase, { 
      userId: user.id,
      title,
      isPersonal: false,
      type: `STORY`,
    })

    if (!isEmpty(createdDeckError)) {
      console.error(`createdDeckError`, createdDeckError)
      return new Response(JSON.stringify({ ...createdDeckError }), { status: 500 })
    }

    const {
      data: createdSentences,
      ...createdSentencesError
    } = await createSentences(supabase, {
      sentences: serializedSentences
    })

    if (!isEmpty(createdSentencesError)) {
      console.error(`createdSentencesError`, createdSentencesError)
      return new Response(JSON.stringify({ ...createdSentencesError }), { status: 500 })
    }

    const { data: createdSentenceCards, ...createdSentenceCardsError } = await createSentenceCards(supabase, {
      sentences: createdSentences,
      deckId: createdDeck.id,
    })

    if (!isEmpty(createdSentenceCardsError)) {
      console.error(`createdSentenceCardsError`, createdSentenceCardsError)
      return new Response(JSON.stringify({ ...createdSentenceCardsError }), { status: 500 })
    }

    // const { data: cardReviews, ...cardReviewError} = await createCardsReviews(supabase, {
    //   cards: createdSentenceCards,
    //   userId: user.id,
    // })

    // if (!isEmpty(cardReviewError)) {
    //   return new Response(JSON.stringify({...cardReviewError }), { status: 500 })
    // }

    const { data: deckCards, ...associateCardsToDeckError } = await associateCardsToDeck(supabase, {
      cards: createdSentenceCards,
      deckId: createdDeck.id,
    })

    if (!isEmpty(associateCardsToDeckError)) {
      return new Response(JSON.stringify({ ...associateCardsToDeckError }), { status: 500 })
    }

    return new Response(JSON.stringify({}), { status: 200 })
  } catch (error) {
    console.dir(error)
    return new Response(JSON.stringify({ error, type: `GeneralError` }), { status: 500 })
  }
}