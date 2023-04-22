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
        front:{
          concept: {
            type: `concept`,
            words: Concepts.words.map((word, index) => {
              return {
                word,
                displayWord: displayConceptWords[index],
                index,
                isTakenWord: true,
              }
            }),
          },
          sentence: {
            type: `sentence`,
            words: sentence.words.map((word, index) => {
              return {
                word,
                displayWord: sentence.display_words[index],
                index,
                isTakenWord: displayConceptSentenceIndexes.includes(index),
              }
            }),
            isExclaimation: sentence.is_exclamation,
            isQuestion: sentence.is_question,
          }
        },
        back: {
          concept: {
            type: `concept`,
            words: Concepts.translation_words.map((word, index) => {
              return {
                word,
                displayWord: displayTranslationWords[index],
                index,
                isTakenWord: true,
              }
            }),
          },
          sentence: {
            type: `sentence`,
            words: sentence.translation_words.map((word, index) => {
              return {
                word,
                displayWord: sentence.translation_display_words[index],
                index,
                isTakenWord: displayTranslationConceptWordsIndexes.includes(index),
              }
            }),
            isExclaimation: sentence.is_exclamation,
            isQuestion: sentence.is_question,
          },
        }
      }
    })
  }

  return deck
}
