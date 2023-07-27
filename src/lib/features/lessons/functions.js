// import { speechToText } from '$lib/features/text-to-speech/functions.js'

import { getSidesForRead, getSectionsForReview, isReviewDue } from '$lib/features/lessons/utilities.js'

export let generateLesson = async ({ deck, prevStage, lessonType }) => {
  const {
    id,
    title,
    cards
  } = deck;

  let stage
  if (prevStage === `read`) {
    stage = `review`
  } else if (prevStage === `review`) {
    stage = `review`
  } else {
    stage = `read`
  }

  let drawPile = []

  if ( stage === `read` ) {
    drawPile = [
      ...cards.map((card) => ({
        cardId: card.id,
        card,
        stage: `read`,
        gradeWeight: 1,
        sides: getSidesForRead({ reviews: card.reviews })
      })).filter(({ sides }) => sides.length > 0)
    ]
  } else if ( stage === `review` ) {
    for (var card of cards) {
      const sections = getSectionsForReview({ reviews: card.reviews })
      for (let section of Object.values(sections)) {
        drawPile.push({
          cardId: card.id,
          stage: `review`,
          gradeWeight: 1,
          sides: section.sides,
          review: section.review,
        })
      }
    }
    drawPile.sort((a, b) => {
      if (a.review.interval > b.review.interval) {
        return -1
      } else if (a.review.interval === b.review.interval) {
        return 0
      } else {
        return 1
      }
    })
  }

  return {
    drawPile,
    stage,
  }
}
