export const serializeStory = ({ title, sentences: originalStorySentences, translatedSentences: translatedStorySentences }) => {
  const normalizedSentences = originalStorySentences.map((sentence, index) => {
    return {
      paragraph: sentence.paragraph,
      sentence: sentence.sentence,
      display_sentence: sentence.displaySentence,
      translation: translatedStorySentences[index].sentence,
      display_translation: translatedStorySentences[index].displaySentence,
      words: sentence.words.map(word => word.word),
      translation_words: translatedStorySentences[index].words.map(word => word.word),
      translation_display_words: translatedStorySentences[index].words.map(word => word.displayWord),
      display_words: sentence.words.map(word => word.displayWord),
      is_question: sentence.isQuestion,
      is_exclamation: sentence.isExclamation,
    }
  });

  return {
    story: {
      title,
    },
    sentences: normalizedSentences,
  }
}
