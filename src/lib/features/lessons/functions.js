// import { speechToText } from '$lib/features/text-to-speech/functions.js'

import { getSidesFromReviews } from '$lib/features/lessons/utilities.js'

export let generateLesson = async ({ deck} ) => {
  const {
    id,
    title,
    cards
  } = deck;

  const lesson = [
    ...cards.map((card) => ({
      cardId: card.id,
      stage: `read`,
      gradeWeight: 1,
      sides: getSidesFromReviews({ reviews: card.reviews })
    })).filter(({ sides }) => sides.length > 0)
  ]

  return lesson
}
