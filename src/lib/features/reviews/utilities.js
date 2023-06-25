import dayjs from 'dayjs';
import { supermemo } from 'supermemo';

export function reviewCard({ review, grade, type }) {
  if (!review) {
    review = {
      interval: 1,
      repetition: 1,
      efactor: 2.5,
    }
  }

  const { interval, repetition, efactor } = supermemo(review, grade);
  
  return {
    data: {
      interval,
      repetition,
      efactor,
      due_date: dayjs(Date.now()).add(interval, 'hour'),
      last_reviewed: new Date(),
      type,
    }
  }
}