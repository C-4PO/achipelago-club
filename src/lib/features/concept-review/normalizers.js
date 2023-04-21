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
      console.log({ sentence })
      return {
        id: Concepts.id,
        type: Concepts.type,
        front:{
          concept: {
            type: `concept`,
            sentence: Concepts.words.map((word, index) => {
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
            sentence: sentence.words.map((word, index) => {
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
  console.log([ deck ])
  return deck
}
