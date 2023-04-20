const normalizeFront = ({
  sentence,
  isExclamation,
  isQuestion
}) => {
  return {
    words: sentence,
    isExclamation,
    isQuestion
  }
}

const normalizeBack = ({
  translation,
  isExclamation,
  isQuestion
}) => {
  return {
    words: translation,
    isExclamation,
    isQuestion
  }
}

export const normalizeSentenceCards = ({ story }) => {
  return story.paragraphs.reduce((accum, paragraph) => {
    return [
      ...accum,
      ...paragraph.map((sentence) => {
        return {
          type: `writeSentence`,
          deckId: story.deckId,
          sentenceId: sentence.id,
          front: normalizeFront(sentence),
          back: normalizeBack(sentence),
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

