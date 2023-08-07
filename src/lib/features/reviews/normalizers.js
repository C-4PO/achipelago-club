import { tomorrow } from '$lib/features/concept-review/utilities.js';
import dayjs from 'dayjs';
import { isReviewDue, isReviewOverdue } from '../lessons/utilities.js';

export const normalizeReview = ({ review }) => {
  const {
    due_date: dueDate,
    last_reviewed: lastReviewed,
    efactor,
    id,
    interval,
    repetition,

  } = review
  return {
    dueDate,
    lastReviewed,
    efactor,
    id,
    interval,
    repetition,
  }
}

export const summerizeReviews = ({ reviews = [], cards }) => {
  console.log({ reviews })
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      totalCardsDue: 0,
      totalCardsOverdue: 0,
      totalNewCards: 0,
    }
  }

  const totalCardsDue = reviews.filter((review) => isReviewDue({ review }) && !isReviewOverdue({ review })).length;
  const totalCardsOverdue = reviews.filter((review) => isReviewOverdue({ review })).length;
  // cards that are not associated with a review by cardId

  console.log(`crds length`, cards.length)
  const totalCardsWithoutReview = cards.filter(({ id }) => !reviews.find(({ card_id }) => card_id === id)).length;

  return {
    totalReviews: reviews.length,
    totalCardsDue: totalCardsDue,
    totalCardsOverdue: totalCardsOverdue,
    totalNewCards: totalCardsWithoutReview,
  }
}
