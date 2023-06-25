export const normalizeSentenceCards = ({ card }) => {
  const {
    id,
    Cards_Reviews = [],
    Sentences: Sentence,
  } = card

  const {
    sentence,
    translation,
    words,
    display_words,
    translation_words,
    translation_display_words,
  } = Sentence

  return normalizeCard({
    id,
    sentence,
    translationSentence: translation,
    words,
    display_words,
    translation_words,
    translation_display_words,
    reviews: Cards_Reviews,
    word_indexes: [],
    translation_word_indexes: [],
    cards: [],
  })
}

export const normalizeCard = ({
  id,
  words,
  display_words,
  translation_display_words,
  translation_words,
  sentence,
  translationSentence,
  word_indexes = [],
  translation_word_indexes = [],
  reviews = [],
  cards = [],
}) => {

  return {
    id,
    sentence,
    translationSentence,
    words: normalizeWords({
      words,
      displayWords: display_words,
      wordIndexes: word_indexes,
    }),
    translationWords: normalizeWords({
      words: translation_words,
      displayWords: translation_display_words,
      wordIndexes: translation_word_indexes,
    }),
    reviews,
  }
}

export const normalizeWords = ({
  words,
  displayWords,
  wordIndexes = []
}) => {
  return words.map((word, index) => ({
    word,
    displayWord: displayWords[index],
    wordIndexes,
  }))
}