const normalizeFront = ({
  sentence,
  id: setenceId,
  isExclamation,
  isQuestion
}) => {
  return {
    words: sentence,
    setenceId,
    isExclamation,
    isQuestion
  }
}

const normalizeBack = ({
  translation,
  id: setenceId,
  isExclamation,
  isQuestion
}) => {
  return {
    words: translation,
    setenceId,
    isExclamation,
    isQuestion
  }
}

export const normalizeReviewCards = ({ story }) => {
  return story.paragraphs.reduce((accum, paragraph) => {
    return [
      ...accum,
      ...paragraph.map((sentence) => {
        return {
          type: `writeSentence`,
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

