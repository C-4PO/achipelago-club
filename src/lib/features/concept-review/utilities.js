import dayjs from 'dayjs';
import { supermemo } from 'supermemo';

export const tomorrow = () => dayjs().add(1, 'day');

// Define a Card class to represent individual flashcards
export class Card {
  constructor({ id, front, back, conceptId, sentenceId }) {
    this.id = conceptId,
    this.front = front; // front of the card
    this.back = back; // back of the card
    this.conceptId = conceptId; // id of the concept
    this.sentenceId = sentenceId; // id of the sentence
    this.interval = 1; // initial interval
    this.repetition = 0; // initial repetition
    this.efactor = 2.5; // initial ease factor
    this.lastReviewed = new Date(); // date of last review
    this.dueDate = dayjs(Date.now());
  }

  // Add a review to the card's history and update the card's next review date
  addReview(rating) {
    const ratingMap = {
      wrong: 0,
      right: 4,
    };
    const ratingValue = ratingMap[rating];
    const { interval, repetition, efactor} = supermemo(this, ratingValue);
    this.interval = interval;
    this.repetition = repetition;
    this.efactor = efactor;
    this.dueDate = dayjs(Date.now()).add(interval, 'hour')
    // console.log('Card:', this.id, 'due date:', 'interval', interval,  this.dueDate.format('YYYY-MM-DD HH:mm:ss'));
  }
}

export function getCardsToReview(cards) {
  return cards
    .sort((a, b) => a.dueDate.isBefore(b.dueDate))
    .filter(card => card.dueDate.isBefore(tomorrow()));
}
