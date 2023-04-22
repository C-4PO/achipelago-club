import { createMachine, assign, send } from 'xstate';
import { evaluateConcept } from './api';
import { getCardsToReview, tomorrow } from './utilities';
import { v4 as uuidv4 } from 'uuid';
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

const saveReviewToAPI = async ({ review }) => {
  return evaluateConcept({
    ...review
  })
};

export const flashCardMachine = createMachine(
  {
    id: 'flashcard',
    initial: states.intro,
    context: {
      enableShuffle: true,
      currentCardIndex: 0,
      cards: [], // modified by the spaced repetition algorithm
      card: null,
      reviewedCards: [{key: 1}, { key: 2}],
      scheduledCards: [], // the list of cards sorted by the spaced repetition algorithm
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
        entry: ['computeCards', 'updateCards'], // modified to include updateCards action
        on: {
          [transitions.REVIEWED]: {
            target: states.loading,
          },
        },
      },
      [states.loading]: {
        invoke: {
          src: (context, event) => saveReviewToAPI(event),
          onDone: {
            actions: [
              send((context, event) => ({
                type: transitions.API_RESPONSE,
                review: event.data,
              })),
            ]
          },
        },
        on: {
          [transitions.API_RESPONSE]: [
            {
              target: states.summary,
              cond: 'allCardsScheduledPast3AM',
              actions: ['reviewCard'],
            },
            {
              target: states.review,
              actions: [
                'reviewCard',
                `incrementCard`,
              ],
            },
          ],
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
      finishReview: assign({
        reviewedCards: (context) => {
          return [
            ...context.reviewedCards.slice(0, context.currentCardIndex),
            { key: context.currentCardIndex + 1, summary: true, message: 'You have finished reviewing all your cards for today.' },
          ]
        }
      }),
      computeCards: assign((context) => {
        const cards = context.cards; // get the current list of cards from context
        const scheduledCards = getCardsToReview(cards); // apply the algorithm
        const card = scheduledCards[0]; // get the next card to review
        return {
          ...context,
          card,
          scheduledCards,
          reviewedCards: [
            ...context.reviewedCards.slice(0, context.currentCardIndex),
            {...card, key: context.currentCardIndex + 1},
            {key: context.currentCardIndex + 2}
          ]
        }
      }),
      reviewCard: (context, event) => {
        const card = context.card;
        card.addReview("good");
      },
      incrementCard: assign({
        currentCardIndex: (context) => context.currentCardIndex + 1,
      }),
      updateCards: assign({ // update the context.cards array with the sorted list
        cards: (context) => {
          const scheduledCards = context.scheduledCards;
          if (!context.enableShuffle) {
            return scheduledCards
          }
          return scheduledCards.slice(1).concat(scheduledCards[0]);
        },
      }),
    },
    guards: {
      allCardsScheduledPast3AM: (context) => {
        return context.cards.every(card => card.dueDate.isAfter(tomorrow()));
      },
    },
  }
);
