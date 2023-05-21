import { createMachine, assign } from 'xstate';

export const cardReviewMachine = createMachine({
  id: 'card-review',
  initial: 'loading',
  context: {
    front: null,
    back: null,
    currentIndex: 0,
    isFlipped: false,
  },
  states: {
    loading: {
      invoke: {
        id: 'fetchCardFaceFront',
        src: 'fetchCardFace',
        onDone: {
          target: 'front',
          actions: [`loadFront`]
        },
        onError: 'failure',
      }
    },
    front: {
      on: {
        FLIP: [
          {
            target: 'finish',
            cond: 'validationFunction'
          },
          {
            target: 'loadingBack',
            actions: ['increment'],
          },
        ],
      }
    },
    loadingBack: {
      invoke: {
        id: 'fetchCardFaceBack',
        src: 'fetchCardFace',
        onDone: {
          target: 'back',
          actions: [`loadBack`],
        },
        onError: 'failure',
      }
    },
    back: {
      on: {
        FLIP: [
          {
            target: 'finish',
            cond: 'validationFunction',
          },
          {
            target: 'loading',
            actions: ['increment'],
          },
        ],
      }
    },
    failure: {
      type: 'final',
    },
    finish: {
      invoke: {
        src: 'finish',
        onDone: 'end'
      },
    },
    end: {
      entry: ['test'],
      type: 'final',
    }
  }
},
{
  actions: {
    test: () => {
      console.log(`end!!`)
    },
    loadFront: assign({
      front: (context, event) => {
        return ({ key: context.currentIndex, ...event.data })
      }
    }),
    loadBack: assign({
      back: (context, event) => ({ key: context.currentIndex, ...event.data })
    }),
    increment: assign({
      currentIndex: ({ currentIndex }) => currentIndex + 1,
      isFlipped: ({ isFlipped }) => !isFlipped,
    })
  },
  services: {
    fetchCardFace: (context, event) => {},
    finish: (context, event) => {}
  },
  guards: {
    validationFunction: (context, event) => { /* ...implementation here... */ }
  }
});
