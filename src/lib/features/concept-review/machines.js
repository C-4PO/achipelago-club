import { createMachine, assign, send } from 'xstate';

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

export const flashCardMachine = createMachine(
  {
    id: 'flashcard',
    initial: states.intro,
    context: {
      // Functions
      shuffleDrawPile: (context, event) => {
        return context.drawPile
      },
      isFinished: (context, event) => {
        return context.cards.length > context.currentCardIndex
      },
      // Functions
      cardFinishCallback: ({ context, event }) => {
        return Promise.resolve({ context, event })
      },
      fetchDrawPile: ({ context, event }) => ({ context, event }) => {
        const { cards, currentCardIndex } = context
        return cards.slice(currentCardIndex)
      }, 
      // Properties
      enableShuffle: true,
      currentCardIndex: 0,
      cards: [], // modified by the spaced repetition algorithm
      card: null,
      tableCards: [{key: 1}, { key: 2}],
      drawPile: [], // the list of cards sorted by the spaced repetition algorithm
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
        entry: ['drawCards', 'shuffleCards'], // modified to include updateCards action
        on: {
          [transitions.REVIEWED]: {
            target: states.loading,
          },
        },
      },
      [states.loading]: {
        invoke: {
          src: (context, event) => context.cardFinishCallback({ context, event }),
          onDone: [
            {
              target: states.summary,
              cond: 'isFinished',
              actions: ['reviewCard']
            },
            {
              target: states.review,
              actions: [
                'reviewCard',
                'incrementCard'
              ]
            }
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
      finishReview: assign({
        tableCards: (context) => {
          return [
            ...context.tableCards.slice(0, context.currentCardIndex),
            { key: context.currentCardIndex + 1, summary: true, message: 'You have finished reviewing all your cards for today.' },
          ]
        }
      }),
      drawCards: assign((context, event) => {
        const drawPile = context.fetchDrawPile({ context, event }); // apply the algorithm
        const card = drawPile[0]; // get the next card to review
        return {
          ...context,
          card,
          drawPile,
          tableCards: [
            ...context.tableCards.slice(0, context.currentCardIndex),
            {...card, key: context.currentCardIndex + 1},{key: context.currentCardIndex + 2}
          ]
        }
      }),
      reviewCard: (context, event) => {
        debugger
        console.log('reviewCard', context, event)
      },
      incrementCard: assign({
        currentCardIndex: (context) => {
          return context.currentCardIndex + 1
        }
      }),
      shuffleCards: assign({ // update the context.cards array with the sorted list
        cards: (context, event) => {
          return context.shuffleDrawPile({ context, event })
        },
      }),
    },
    guards: {
      isFinished: (context, event) => {
        return context.isFinished({ context, event })
      },
    },
  }
);
