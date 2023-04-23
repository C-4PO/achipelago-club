import union from 'lodash/union'

export const normalizeDeck = ({ deckData }) => {
  const deck = {
    id: deckData.Decks.id,
    title: deckData.Decks.title,
    isPersonal: deckData.Decks.is_personal,
    cards: deckData.Decks.Concepts_Decks.map(({ Concepts: concept }) => {
      const {
        Sentences: sentence,
        display_words: displayConceptWords,
        display_translation_words: displayTranslationWords,
        display_words_indexes: displayConceptSentenceIndexes,
        display_translation_words_indexes: displayTranslationConceptWordsIndexes,
      } = concept.Concepts_Sentences[0]

      return {
        id: concept.id,
        cardType: `translation`,
        conceptId: concept.id,
        sentenceId: sentence.id,
        deckId:deckData.Decks.id,
        metaData: {
          type: concept.type,
        },
        front:{
          concept: {
            type: `concept`,
            words: concept.words.map((word, index) => {
              return {
                word,
                displayWord: displayConceptWords[index],
                index,
              }
            }),
            sentenceIndexes: displayConceptSentenceIndexes,
          },
          sentence: {
            id: sentence.id,
            type: `sentence`,
            words: sentence.words.map((word, index) => {
              return {
                word,
                displayWord: sentence.display_words[index],
                index,
              }
            }),
            isExclaimation: sentence.is_exclamation,
            isQuestion: sentence.is_question,
          }
        },
        back: {
          concept: {
            type: `concept`,
            words: concept.translation_words.map((word, index) => {
              return {
                word,
                displayWord: displayTranslationWords[index],
                index,
              }
            }),
            sentenceIndexes: displayTranslationConceptWordsIndexes,
          },
          sentence: {
            id: sentence.id,
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

export const normalizeRelatedConceptsInDeck = ({
  deck,
  relatedConceptData = [],
}) => {
  return {
    ...deck,
    cards: deck.cards.map((card) => {
      return {
        ...card,
        front: {
          ...card.front,
          sentence: {
            ...card.front.sentence,
            takenIndexes: union(
              relatedConceptData
                .filter(concept => concept.sentence_id === card.front.sentence.id)
                .map(({ display_words_indexes }) => display_words_indexes)
                .flat()
            )
          },
        },
        back: {
          ...card.back,
          sentence: {
            ...card.back.sentence,
            takenIndexes: union(
              relatedConceptData
                .filter(concept => concept.sentence_id === card.back.sentence.id)
                .map(({ display_translation_words_indexes }) => display_translation_words_indexes)
                .flat()
            )
          }
        }
      }
    }),
  }
}

export const normalizeReviewInDeck = ({ deck, reviewData = [] }) => {
  const dueDateData = reviewData.map(({
    Concepts: concept,
  }) => {
    return {
      concept_id: concept.id,
      due_date: concept.Concepts_Reviews[0].due_date,
      _review: concept.Concepts_Reviews[0],
    }
  })

  return {
    ...deck,
    cards: deck.cards.map((card) => {
      const {
        conceptId,
        due_date,
        ..._review
      } = dueDateData.find(({ concept_id }) => concept_id === card.conceptId)
      return {
        ...card,
        _review,
        dueDate: due_date,
      }
    }),
  }
}