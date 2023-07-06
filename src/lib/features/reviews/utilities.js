import dayjs from 'dayjs';
import { supermemo } from 'supermemo';

export function reviewCard({ review, grade, type }) {
  const MILLISECONDS_IN_3_HOURS = 3 * 60 * 60 * 1000;

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
      due_date: dayjs().add(interval * MILLISECONDS_IN_3_HOURS).toDate(),
      last_reviewed: new Date(),
      type,
    }
  }
}