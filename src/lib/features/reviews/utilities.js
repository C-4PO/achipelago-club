import dayjs from 'dayjs';
import { supermemo } from 'supermemo';

export function reviewCard({ review, grade, type }) {
  const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

  if (!review) {
    review = {
      interval: 0,
      repetition: 0,
      efactor: 2.5,
    }
  }

  const { interval, repetition, efactor } = supermemo(review, grade);
  
  return {
    data: {
      interval,
      repetition,
      efactor,
      due_date: dayjs().add(interval * MILLISECONDS_IN_DAY).toDate(),
      last_reviewed: new Date(),
      type,
    }
  }
}