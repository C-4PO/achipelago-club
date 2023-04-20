export const saveConcepts = async (supabase, {
  concepts,
  userId,
  deckId,
  sentenceId,
}) => {
  const savedConcpets = await Promise.all(concepts.map(async (concept) => {
    return saveConcept(supabase, { concept, userId, deckId, sentenceId })
  }))
  return savedConcpets
}

export const saveConcept = async (supabase, {
  concept,
  deckId,
  sentenceId,
}) => {
  const { data, error: conceptError } = await supabase.from('Concepts').insert([{
    words: concept.words.map(({ word }) => word),
    translation_words: concept.translationWords.map(({ word }) => word),
    type: concept.type,
  }]).select().limit(1).single()

  if (conceptError) {
    console.error('Error saving concept', conceptError)
    return { error: conceptError }
  }

  const conceptId = data.id

  const { error: deckConceptError } = await supabase.from('Concepts_Decks').insert([{
    deck_id: deckId,
    concept_id: conceptId,
  }])

  if (deckConceptError) {
    console.error('Error saving deck_concept', deckConceptError)
    return { error: deckConceptError }
  }

  if (deckConceptError) {
    console.error('Error saving deck_concept', deckConceptError)
    return { error: deckConceptError }
  }

  console.log({ sentenceId })

  const { error: deckSentenceError } = await supabase.from('Concepts_Sentences').insert([{
    sentence_id: sentenceId,
    concept_id: conceptId,
    display_words: concept.words.map(({ displayWord }) => displayWord),
    display_words_indexes: concept.words.map(({ index }) => index),
    display_translation_words: concept.translationWords.map(({ displayWord }) => displayWord),
    display_translation_words_indexes: concept.translationWords.map(({ index }) => index),
  }])

  if (deckSentenceError) {
    console.error('Error saving deck_sentence', deckSentenceError)
    return { error: deckSentenceError }
  }

  return { data }
}
