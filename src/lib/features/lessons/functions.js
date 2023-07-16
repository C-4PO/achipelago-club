// import { speechToText } from '$lib/features/text-to-speech/functions.js'

import { getSidesFromReviews } from '$lib/features/lessons/utilities.js'

export let generateLesson = async ({ deck, prevStage, lessonType }) => {
  const {
    id,
    title,
    cards
  } = deck;

  const drawPile = [
    ...cards.map((card) => ({
      cardId: card.id,
      stage: `read`,
      gradeWeight: 1,
      sides: getSidesFromReviews({ reviews: card.reviews })
    })).filter(({ sides }) => sides.length > 0)
  ]

  let stage
  if (prevStage === `read`) {
    stage = `review`
  } if (prevStage === `review`) {
    stage = `review`
  } else {
    stage = `read`
  }

  return {
    drawPile,
    stage,
  }
}
