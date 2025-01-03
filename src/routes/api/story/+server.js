
import { serializeStory } from '$lib/features/story/serializers.js'
import { processStory } from '$lib/features/story/utilities.js'
import { saveStory } from '$lib/features/story/functions.js'
import { getPersonalDeck } from '$lib/features/story/functions.js'
import { translate } from '$lib/features/text-to-speech/functions.js'

export const POST = async ({ request, locals: { supabase, getSession } }) => {
  const session = await getSession()
  const { user } = session || {}

  let {
    title,
    originalStory,
    translatedStory
  } = await request.json()

  title = title ? title : originalStory.split(`.`)[0]

  try {
    translatedStory = translatedStory ? translatedStory : originalStory ? await translate({ text: originalStory, target: `en` }) : ''
    console.log('translatedStory', translatedStory)
  } catch (error) {
    console.log(`error`, error)
  }

  const [
    originalStorySentences,
    translatedStorySentences
  ] = [originalStory, translatedStory].map(story => processStory({ story }))

  const {
    story: serializedStory,
    sentences: serializedSentences,
  } = serializeStory({
    title,
    sentences: originalStorySentences,
    translatedSentences: translatedStorySentences
  })

  const { data: personalDeck, error: deckError } = await getPersonalDeck(supabase, { userId: user.id })

  if (deckError) {
    return new Response(JSON.stringify({ error: deckError }), { status: 500 })
  }

  const response = await saveStory(supabase, {
    story: serializedStory,
    sentences: serializedSentences,
    user_id: user.id,
    deck_id: personalDeck.id
  })

  return new Response(JSON.stringify({ response }), { status: 200 })
}
