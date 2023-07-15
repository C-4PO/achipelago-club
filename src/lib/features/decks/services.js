import { useMachine } from '$lib/features/utilities.js';
import { stateIndex } from '$lib/features/utilities.js';
import { getSidesFromReviews } from '$lib/features/lessons/utilities.js';
import { derived } from 'svelte/store';

import { deckReviewMachine } from './machines.js'

export const deckReviewService = ({
  lesson
}) => {

  const reviewDeck = ({ context, event }) => context

  const reviewCard = ({ context, event }) => {
    const reviews = Object.values(event.results).map(({ review }) => review)
    context.currentPile.card.reviews = reviews
    context.currentPile.sides = getSidesFromReviews({ reviews })
    let drawPile = context.drawPile

    if (context.stage === `review`) {
      drawPile = drawPile.filter(({ reviews }) => reviews.length > 0)
     /*
      .sort((a, b) => {
        const aRating = a.reviews.reduce((acc, { rating }) => acc + rating, 0) / a.reviews.length
        const bRating = b.reviews.reduce((acc, { rating }) => acc + rating, 0) / b.reviews.length
        return bRating - aRating
      }
      */
    } else if (context.stage === `read`) {
      drawPile.shift()
    }

    return {
      ...context,
      drawPile,
    }
  }

  const calculateFinished = ({ context, event}) => {
    return context.drawPile.length === 0
  }

  const { state, send, service } = useMachine(deckReviewMachine, {
    context: {
      stage: 'read',
      drawPile: lesson,
      reviewCard,
      reviewDeck,
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