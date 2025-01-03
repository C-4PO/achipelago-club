import { useMachine } from '$lib/features/utilities.js';
import { stateIndex } from '$lib/features/utilities.js';
import { getSidesForRead } from '$lib/features/lessons/utilities.js';
import { loadStage } from '$lib/features/lessons/api.js';
import { derived } from 'svelte/store';
import { goto } from '$app/navigation';

import { deckReviewMachine } from './machines.js'

export const deckReviewService = ({
  drawPile,
  stage,
  deckId,
  cards,
}) => {

  const reviewDeck = ({ context, event }) => context

  const reviewCard = ({ context, event }) => {
    const reviews = Object.values(event.results).map(({ review }) => review)
    // Editiong pointer to effect all instances of the pile
    let drawPile = context.drawPile

    if (context.stage === `review`) {
      context.currentPile.card.reviews = reviews
      context.currentPile.sides = getSidesForRead({ reviews })

      drawPile = drawPile.filter(({ sides }) => sides.length > 0)

      const leadingCard = drawPile.shift()
      
      drawPile = drawPile.sort((a, b) => {
        const aRating = a.reviews.reduce((acc, { repetition }) => acc + repetition, 0) / a.reviews.length
        const bRating = b.reviews.reduce((acc, { repetition }) => acc + repetition, 0) / b.reviews.length
        return bRating - aRating
      })
      if (leadingCard) {
        drawPile = [...drawPile, leadingCard]
      }
    } else if (context.stage === `read`) {
      context.currentPile.card.reviews = reviews
      context.currentPile.sides = getSidesForRead({ reviews })
      drawPile.shift()
    }

    return {
      ...context,
      drawPile,
    }
  }

  const performStageGenerate = async ({ context, event }) => {
    return loadStage({
      stage: context.stage,
      lessonType: `story`,
      deckId,
    })
  }

  const calculateFinished = ({ context, event}) => {
    return context.drawPile.length === 0
  }

  const finish = () => goto(`/story-list`)

  const { state, send, service } = useMachine(deckReviewMachine, {
    context: {
      cards,
      stage,
      drawPile,
      reviewCard,
      reviewDeck,
      calculateFinished,
      finish,
      performStageGenerate,
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

  const info = derived(
    state,
    $state => ({
      hasRemainingCards: $state.context.drawPile.length > 0
    })
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
    send(`REVIEWED`, detail )
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
    info,
  }
}