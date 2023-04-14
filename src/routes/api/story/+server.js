
import { serializeStory } from '$lib/features/story/serializers.js'
import { processStory } from '$lib/features/story/utilities.js'
import { translate, saveStory } from '$lib/features/story/functions.js'

export const POST = async ({ request }) => {
  let {
    title,
    originalStory,
    translatedStory
  } = await request.json()
  
  translatedStory = translatedStory ? translatedStory : originalStory ? await translate({ text: originalStory }) : ''

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

  const response = await saveStory({
    story: serializedStory,
    sentences: serializedSentences
  })

  return new Response(JSON.stringify({ response }), { status: 200 })
}
