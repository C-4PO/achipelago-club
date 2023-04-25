import { createMachine, assign } from 'xstate';
import { saveConcepts } from './api';

export const transitions = {
  START: 'START',
  REVIEWED: 'NEXT_CARD',
  API_RESPONSE: 'API_RESPONSE',
};

export const states = {
  intro: 'intro',
  review: 'review',
  loading: 'loading',
  summary: 'summary',
};

const saveReviewToAPI = async (reviewItem) => {
  return saveConcepts({
    ...reviewItem
  })
};

export const flashCardMachine = createMachine(
  {
    id: 'flashcard',
    initial: states.intro,
    context: {
      currentCardIndex: 0,
      cards: [],
      reviewItems: [],
    },
    states: {
      [states.intro]: {
        on: {
          [transitions.START]: {
            target: states.review,
          },
        },
      },
      [states.review]: {
        entry: 'indexCard',
        on: {
          [transitions.REVIEWED]: {
            target: states.loading,
            actions: 'setReviewItem',
          },
        },
      },
      [states.loading]: {
        invoke: {
          src: (context, event) => saveReviewToAPI(event.review),
          onDone: [
            {
              target: states.summary,
              cond: 'lastCard',
            },
            {
              target: states.review,
              actions: 'nextCard',
            }, 
          ]
        },
      },
      [states.summary]: {
        entry: 'finishReview',
        type: 'final',
      },
    },
  },
  {
    actions: {
      finishReview: (context) => {
        console.log('Review complete:', context.reviewItems);
      },
      nextCard: assign({
        currentCardIndex: (context) => context.currentCardIndex + 1,
      }),
      indexCard: (context) => {
        const card = context.cards[context.currentCardIndex];
        console.log('Reviewing card:', card);
      },
      setReviewItem: assign({
        reviewItems: (context, event) => {
          return [...context.reviewItems, event.review];
        }
      }),
    },
    guards: {
      lastCard: (context) => {
        return context.currentCardIndex === context.cards.length - 1;
      },
    },
  }
);

export default flashCardMachine;
