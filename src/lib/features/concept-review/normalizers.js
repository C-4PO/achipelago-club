export const normalizeDeck = ({ deckData }) => {
  const deck = {
    id: deckData.Decks.id,
    title: deckData.Decks.title,
    isPersonal: deckData.Decks.is_personal,
    cards: deckData.Decks.Concepts_Decks.map(({ Concepts }) => {
      const {
        Sentences: sentence,
        display_words: displayConceptWords,
        display_translation_words: displayTranslationWords,
        display_words_indexes: displayConceptSentenceIndexes,
        display_translation_words_indexes: displayTranslationConceptWordsIndexes,
      } = Concepts.Concepts_Sentences[0]
      return {
        id: Concepts.id,
        type: Concepts.type,
        front: {
          conceptWords: Concepts.words,
          displayConceptWords,
          sentenceWords: sentence.words,
          displayConceptSentenceIndexes,
          displaySentenceWords: sentence.display_words,
          paragraph: sentence.paragraph,
          isExclaimation: sentence.is_exclamation,
          isQuestion: sentence.is_question,
        },
        back: {
          conceptWords: Concepts.translation_words,
          sentenceWords: sentence.translation_words,
          displayConceptWords: displayTranslationWords,
          displayConceptSentenceIndexes: displayTranslationConceptWordsIndexes,
          displaySentenceWords: sentence.translation_display_words,
          paragraph: sentence.paragraph,
          isExclaimation: sentence.is_exclamation,
          isQuestion: sentence.is_question,
        }
      }
    })
  }
  return deck
}
