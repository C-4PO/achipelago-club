import union from 'lodash/union'
import dayjs from 'dayjs'

export const normalizeCard = ({ concept, deckId, relatedSentence }) => {
  const {
    Sentences: sentence,
    display_words: displayConceptWords,
    display_translation_words: displayTranslationWords,
    display_words_indexes: displayConceptSentenceIndexes,
    display_translation_words_indexes: displayTranslationConceptWordsIndexes,
  } = relatedSentence

  console.log(`ges here`)

  return {
    id: concept.id,
    cardType: `translation`,
    conceptId: concept.id,
    sentenceId: sentence.id,
    deckId,
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
}

export const normalizeConceptCards = ({ cards, deckId }) => {
  console.log({ cards })
  return cards.map((card) => {
    console.log( `in here`)
    return normalizeCard({ concept: card, deckId, relatedSentence: card.Concepts_Sentences[0] })
  })
}

export const normalizeDeck = ({ deckData }) => {
  const deck = {
    id: deckData.Decks.id,
    title: deckData.Decks.title,
    isPersonal: deckData.Decks.is_personal,
    cards: deckData.Decks.Concepts_Decks.map(({ Concepts: concept}) => {
      return normalizeCard({ concept, deckId: deckData.Decks.id, relatedSentence: concept.Concepts_Sentences[0] })
    })
  }
  return deck
}

export const normalizeRelatedConceptsInConceptCards = ({
  cards,
  relatedConceptData = [],
}) => {
  return cards.map((card) => {
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
  })
}

export const normalizeReviewInConceptCards = ({ cards, reviewData = [] }) => {
  const reviewMap = reviewData.reduce((acc, review) => {
    acc[review.Concepts.id] = review.Concepts.Concepts_Reviews[0]
    return acc
  }, {})

  cards = cards.map((card) => {
    const {
      efactor,
      interval,
      last_reviewed,
      repetition,
      due_date,
    } = reviewMap[card.conceptId]
    return {
      ...card,
      review: {
        efactor,
        interval,
        lastReviewed: dayjs(last_reviewed),
        repetition,
        dueDate: dayjs(due_date),
      },
    }
  })


  return cards
}