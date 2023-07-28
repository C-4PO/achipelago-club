import { createMachine, assign } from 'xstate';

export const deckReviewMachine = createMachine(
  {
    id: `deck-review`,
    initial: 'intro',
    predictableActionArguments: true,
    context: {
      stage: 'read',
      drawPile: [],
      cards: [],
      currentIndex: 0,
      currentPile: null,
      tableCards: [{key: 1}, { key: 2}],
      lastCard: null,
      reviewCard: ({ context, event }) => context,
      reviewDeck: ({ context, event }) => context,
      performSummerize: ({ context, event }) => Promise.resolve(),
      calculateFinished: ({ context, event }) => false,
      performStageGenerate: ({ context, event }) => Promise.resolve(),
      finish: () => {},
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
          REVIEWED: [
            {
              target: 'finishReview',
              actions: ['increment', 'reviewCard']
            },
          ]
        }
      },
      finishReview: {
        always: [
          {
            target: 'generateStage',
            cond: 'isFinished',
          },
          {
            target: 'review',
          }
        ]
      },
      evalateStage: {
        entry: ['drawStage'],
        on: {
          REVIEWED: {
            target: 'review',
            actions: ['increment']
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
              target: 'evalateStage',
              actions: ['loadStage']
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
        entry: ['finish'],
        type: 'final'
      }
    },
  },
  {
    actions: {
      drawCard: assign((context, event) => {
        const lastCard = context.currentPile
        const currentPile = context.drawPile[0]
        return {
          ...context,
          lastCard,
          currentPile,
          tableCards: [
            ...context.tableCards.slice(0, context.currentIndex),
            { key: context.currentIndex + 1, pile: currentPile, initialized: true},
            { key: context.currentIndex + 2 }
          ]
        }
      }),
      drawStage: assign((context, event) => {
        const lastCard = context.currentPile
        const currentPile = {
          sides: [
            {
              type: `stageSummary`
            }
          ]
        }
        return {
          ...context,
          lastCard,
          currentPile,
          tableCards: [
            ...context.tableCards.slice(0, context.currentIndex),
            { key: context.currentIndex + 1, pile: currentPile, initialized: true},
            { key: context.currentIndex + 2 }
          ]
        }
      }),
      loadStage: assign((context, event) => {
        debugger
        const stage = event.data.stage
        const drawPile = event.data.drawPile.map((pile) => {
          return {
            ...pile,
            card: context.cards.find((card) => card.id === pile.cardId)
          }
        })
        return {
          ...context,
          stage,
          drawPile,
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
      }),
      finish: (context, event) => {
        context.finish()
      }
    },
    guards: {
      isFinished: (context, event) => {
        return context.calculateFinished({ context, event })
      }
    },
  }
)