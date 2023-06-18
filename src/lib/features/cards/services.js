import { useMachine } from '$lib/features/utilities.js';
import { stateIndex } from '$lib/features/utilities.js';
import { derived, writable } from 'svelte/store';
import { cardReviewMachine } from '$lib/features/cards/machines.js'

export const cardReviewService = ({
  pile,
  onFinish = async () => {},
  onError = async () => {}
}) => {
  const { state, send, service } = useMachine(cardReviewMachine, {
    services: {
      fetchCardFace: async (context, event) => {
        return pile.sides[context.currentIndex]
      },
      finish: onFinish,
    },
    guards: {
      validationFunction: (context, event) => {
        return context.currentIndex === pile.sides.length - 1
      }
    }
  })

  const step = derived(
    state,
    $state => stateIndex($state.value)
  );

  const front = derived(
    state,
    $state => $state.context.front
  )

  const back = derived(
    state,
    $state => $state.context.back
  )

  const isFlipped = derived(
    state,
    $state => $state.context.isFlipped
  )

  const onNext = ({ shared }) => {
    send('FLIP', shared)
  }

  return {
    onNext,
    front,
    back,
    isFlipped,
    step,
    send,
    service,
  }
}