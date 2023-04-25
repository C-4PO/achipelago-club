export const serializeNewConcepts = (concepts) => {
  return concepts.map(concept => {
    return {
      words: concept.words.map(({ word }) => word),
      translation_words: concept.translationWords.map(({ word }) => word),
      display_words: concept.words.map(({ displayWord }) => displayWord),
      display_translation_words: concept.translationWords.map(({ displayWord }) => displayWord),
      display_words_indexes: concept.words.map(({ index }) => index),
      display_translation_words_indexes: concept.translationWords.map(({ index }) => index),
      sentence_id: concept.sentenceId
    }
  })
}
