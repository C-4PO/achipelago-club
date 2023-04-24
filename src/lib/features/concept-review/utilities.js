import dayjs from 'dayjs';
import { supermemo } from 'supermemo';

export const tomorrow = () => dayjs().add(1, 'day');

function calculatePercentageConceptError({
  errorIndexes,
  sentenceIndexes
}) {
  let matches = 0;

  for (const element of sentenceIndexes) {
    if (errorIndexes.includes(element)) {
      matches++;
    }
  }

  const percentage = 1 - (matches / sentenceIndexes.length);

  return percentage;
}

function calculatePercentageSentenceError({
  errorIndexes,
  sentenceLength,
  sentenceIndexes
}) {
  const sentenceLengthWithoutConcept = sentenceLength - sentenceIndexes.length;
  const errorIndexesWithoutConcept = errorIndexes.filter((index) => !sentenceIndexes.includes(index));
  const percentage = 1 - errorIndexesWithoutConcept.length / sentenceLengthWithoutConcept;
  return percentage;
}

export function reviewTranslationCards({ card, review }) {

  const sentenceIndexes = card.front.concept.sentenceIndexes
  const sentenceLength = card.back.sentence.words.length
  const errorIndexes = review.errorIndexes

  const percentageConceptError = calculatePercentageConceptError({
    errorIndexes,
    sentenceIndexes,
  });

  const percentageSentenceError = calculatePercentageSentenceError({
    errorIndexes,
    sentenceIndexes,
    sentenceLength,
  });

  return Math.floor(((percentageConceptError * 3/5) + (percentageSentenceError * 2/5)) * 5)
}

export function reviewCard({ card, review }) {
  const reviewerMap = {
    translation: reviewTranslationCards,
  }
  const reviewer = reviewerMap[card.cardType];

  if (reviewer) {
    const ratingValue = reviewer({ card, review });
    console.log('ratingValue', ratingValue)
    const { interval, repetition, efactor } = supermemo(card.review, ratingValue);
    
    return {
      interval,
      repetition,
      efactor,
      due_date: dayjs(Date.now()).add(interval, 'hour'),
      last_reviewed: new Date(),
    }
  }
  return card.review
}

export function getCardsToReview(cards) {
  return cards
    .sort((a, b) => a.review.dueDate.isBefore(b.review.dueDate))
    .filter(card => card.review.dueDate.isBefore(tomorrow()));
}

