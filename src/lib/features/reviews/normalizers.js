import { tomorrow } from '$lib/features/concept-review/utilities.js';
import dayjs from 'dayjs';

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

export const summerizeReviews = ({ reviews }) => {
  const totalCardsDue = reviews.filter(({ due_date }) => dayjs(due_date).isAfter(dayjs()) && dayjs(due_date).isBefore(tomorrow())).length;
  const totalCardsOverdue = reviews.filter(({ due_date, interval }) => dayjs(due_date).isBefore(dayjs()) && interval > 3).length;
  const totalNewCards = reviews.filter(({ repetition }) => repetition === 0).length;
  
  return {
    totalCards: reviews.length,
    totalCardsDue: totalCardsDue,
    totalCardsOverdue: totalCardsOverdue,
    totalNewCards,
  }
}
