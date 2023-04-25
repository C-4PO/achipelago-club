const normalizeFront = ({
  sentence,
  isExclamation,
  isQuestion,
  id: sentenceId, 
}) => {
  return {
    words: sentence,
    isExclamation,
    isQuestion,
    sentenceId,
    id: sentenceId,
  }
}

const normalizeBack = ({
  translation,
  isExclamation,
  isQuestion,
  id: sentenceId,
}) => {
  return {
    words: translation,
    isExclamation,
    isQuestion,
    sentenceId,
    id: sentenceId,
  }
}

export const normalizeSentenceCards = ({ story }) => {
  return story.paragraphs.reduce((accum, paragraph, index) => {
    return [
      ...accum,
      ...paragraph.map((sentence) => {
        return {
          id: sentence.id,
          type: `translation`,
          deckId: story.deckId,
          sentenceId: sentence.id,
          key: sentence.id,
          metaData: {},
          front: {
            sentence: normalizeFront(sentence),
          },
          back: {
            sentence: normalizeBack(sentence),
          },
          grade: null,
        }
      }),
      // {
      //   type: `ParagraphReview`,
      //   front: {
      //     paragraph,
      //   },
      //   back: {
      //     paragraph,
      //   },
      //   grade: null,
      // }
    ]
  }, [])
}

