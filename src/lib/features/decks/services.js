import { useMachine } from '$lib/features/utilities.js';
import { stateIndex } from '$lib/features/utilities.js';
import { getSidesFromReviews } from '$lib/features/lessons/utilities.js';
import { derived } from 'svelte/store';

import { deckReviewMachine } from './machines.js'

export const deckReviewService = ({
  lesson
}) => {
  const fetchDrawPile = ({ context: { currentIndex, _cards , ...rest}, event }) => {
    debugger
    return _cards.slice(currentIndex, _cards.length)
  }

  const reviewDeck = ({ context, event }) => context
  
  const performReview = ({ context,  event }) => {
    const reviews = Object.values(event.results).map(({ review }) => review)
    const sides = getSidesFromReviews({ reviews })    
    return Promise.resolve({
      reviews,
      sides,
    })
  }
  const reviewCard = ({ context, event }) => {
    return context
  }
  const performSummerize = ({ context, event }) => Promise.resolve()
  const calculateFinished = ({ context, event}) => {
    console.log({ context })
    debugger
    if (context._cards.length - 1 !== context.currentIndex) {
      return false
    }
    return true
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
    if (detail.action === 'finish') {
      console.log('FINISH', detail)
      send(`FINISH`, detail)
    } else if (detail.action === `next`) {
      console.log('REVIEWED', detail)
      send(`REVIEWED`, detail )
    }
  }

  const onFinish = () => {
    send(`FINISH`)
  }

  return {
    slides,
    onNext,
    currentIndex,
    context,
    step,
    send,
    onFinish,
    service,
  }
}