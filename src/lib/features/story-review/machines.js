import { createMachine, assign, send } from "xstate";

export const transitions = {
  START: `START`,
  REVIEWED: `NEXT_CARD`,
};

export const states = {
  intro: `intro`,
  review: `review`,
  summary: `summary`,
};

export const flashCardMachine = createMachine(
  {
    id: 'flashcard',
    initial: states.intro,
    predictableActionArguments: true,
    context: {
      currentCardIndex: 0,
      cards: [],
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
          [transitions.REVIEWED]: [
            {
              target: states.summary,
              cond: 'lastCard',
            },
            {
              target: states.review,
              actions: 'nextCard',
            },
          ],
        },
      },
      [states.summary]: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      nextCard: assign({
        currentCardIndex: (context) => context.currentCardIndex + 1,
      }),
      indexCard: (context) => {
        const card = context.cards[context.currentCardIndex];
        console.log('Reviewing card:', card);
      },
    },
    guards: {
      lastCard: (context) => {
        return context.currentCardIndex === context.cards.length - 1;
      },
    },
  }
);

export default flashCardMachine;