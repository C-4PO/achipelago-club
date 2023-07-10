import { createMachine, assign } from 'xstate';

export const deckReviewMachine = createMachine(
  {
    id: `deck-review`,
    initial: 'intro',
    context: {
      _cards: [],
      currentIndex: 0,
      currentCard: null,
      tableCards: [{key: 1}, { key: 2}],
      drawPile: [],
      lastCard: null,
      fetchDrawPile: ({ context, event }) => [],
      reviewCard: ({ context, event }) => context,
      reviewDeck: ({ context, event }) => context,
      performReview: ({ context,  event }) => Promise.resolve(),
      performSummerize: ({ context, event }) => Promise.resolve(),
      calculateFinished: ({ context, event }) => false,
      performStageGenerate: ({ context, event }) => Promise.resolve(),
    },
    states: {
      intro: {
        on: {
          START: [
            {
              target: `summary`,
              cond: 'isFinished',
            },
            {
              target: `review`,
            }
          ]
        }
      },
      review: {
        entry: ['drawCard'],
        on: {
          REVIEWED: {
            target: 'finishReview',
          }
        }
      },
      finishReview: {
        invoke: {
          src: (context, event) => context.performReview({ context, event }),
          onDone: [
            {
              target: 'evalateStage',
              cond: 'isFinished',
              actions: ['reviewCard']
            },
            {
              target: 'review',
              actions: ['reviewCard', 'increment']
            }
          ]
        }
      },
      evalateStage: {
        entry: ['drawStage'],
        on: {
          REVIEWED: {
            target: 'generateStage',
          },
          FINISH: {
            target: 'finalizeDeck',
          }
        }
      },
      generateStage: {
        invoke: {
          src: (context, event) => context.performStageGenerate({ context, event }),
          onDone: [
            {
              target: 'review',
              actions: 'reviewDeck'
            }
          ]
        }
      },
      finalizeDeck: {
        invoke: {
          src: (context, event) => context.performSummerize({ context, event }),
          onDone: [
            {
              target: 'summary',
              actions: 'reviewDeck'
            }
          ]
        }
      },
      summary: {
        type: 'final'
      }
    },
  },
  {
    actions: {
      drawCard: assign((context, event) => {
        const lastCard = context.currentCard
        const drawPile = context.fetchDrawPile({ context, event })
        const currentCard = drawPile[0]
  
        return {
          ...context,
          _cards: drawPile,
          lastCard,
          currentCard,
          tableCards: [
            ...context.tableCards.slice(0, context.currentIndex),
            { key: context.currentIndex + 1, ...currentCard, initialized: true},
            { key: context.currentIndex + 2 }
          ]
        }
      }),
      drawStage: assign((context, event) => {
        debugger
        const lastCard = context.currentCard
        const currentCard = {
          card: null,
          sides: [
            {
              type: `stageSummary`
            }
          ]
        }
        return {
          ...context,
          lastCard,
          currentCard,
          tableCards: [
            ...context.tableCards.slice(0, context.currentIndex),
            { key: context.currentIndex + 1, ...currentCard, initialized: true},
            { key: context.currentIndex + 2 }
          ]
        }
      }),
      loadStage: assign((context, event) => {
        const _cards = event.data.cards
        return {
          ...context,
          _cards,
        }
      }),
      reviewCard: assign((context, event) => {
        return context.reviewCard({ context, event })
      }),
      reviewDeck: assign((context, event) => {
        return context
      }),
      increment: assign({
        currentIndex: (context) => {
          return context.currentIndex + 1
        }
      })
    },
    guards: {
      isFinished: (context, event) => {
        return context.calculateFinished({ context, event })
      }
    },
  }
)