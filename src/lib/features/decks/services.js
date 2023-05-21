import { useMachine } from '$lib/features/utilities.js';
import { stateIndex } from '$lib/features/utilities.js';
import { derived } from 'svelte/store';

import { deckReviewMachine } from './machines.js'

export const deckReviewService = ({
  lesson
}) => {

  const fetchDrawPile = ({ context: { currentIndex, ...rest }, event }) => {
    return lesson.slice(currentIndex, lesson.length)
  }
  const reviewCard = ({ context, event }) => context
  const reviewDeck = ({ context, event }) => context
  const performReview = ({ context,  event }) => Promise.resolve()
  const performSummerize = ({ context, event }) => Promise.resolve()
  const calculateFinished = ({ context, event}) => {
    return false
  }

  const { state, send, service } = useMachine(deckReviewMachine, {
    context: {
      _cards: lesson,
      fetchDrawPile,
      reviewCard,
      reviewDeck,
      performReview,
      performSummerize,
      calculateFinished,
    }
  })

  const step = derived(
    state,
    $state => stateIndex($state.value)
  );

  const context = derived(
    state,
    $state => $state.context
  );

  const slides = derived(
    state,
    $state => $state.context.tableCards,
  )

  const currentIndex = derived(
    state,
    $state => $state.context.currentIndex,
  )

  const onNext = ({ detail }) => {
    console.log('onNENENE')
    send(`REVIEWED`)
  }

  return {
    slides,
    onNext,
    currentIndex,
    context,
    step,
    send,
    service,
  }
}