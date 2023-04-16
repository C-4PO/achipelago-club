const normalizeSentence = ({
  words,
  displayWords,
}) => {
  return words.map((word, index) => {
    return {
      word,
      displayWord: displayWords[index],
      index,
    }
  })
}

export const normalizeStory = ({
  Sentences,
  ...story
} = {}) => {
  const sentences = Sentences.map(({
    id,
    paragraph,
    words,
    display_words,
    translation_words,
    translation_display_words,
    created_at,
    is_question,
    is_exclamation,
  }) => {
    return {
      id,
      created_at,
      paragraphIndex: paragraph,
      isQuestion: is_question,
      isExclamation: is_exclamation,
      sentence: normalizeSentence({
        words,
        displayWords: display_words,
      }),
      translation: normalizeSentence({
        words: translation_words,
        displayWords: translation_display_words,
      }),
    }
  })

  const paragraphs = Object.values(sentences.reduce((acc, sentence) => {
    const { paragraphIndex } = sentence
    if (!acc[paragraphIndex]) {
      acc[paragraphIndex] = []
    }
    acc[paragraphIndex].push(sentence)
    return acc
  }, []))

  return {
    ...story,
    paragraphs,
  }
}