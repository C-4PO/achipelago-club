import { useMachine } from '$lib/features/utilities.js';
import { stateIndex } from '$lib/features/utilities.js';
import { normalizeReviewClient, normalizeCardClient } from './normalizers';
import { derived} from 'svelte/store'
import { tomorrow } from './utilities';
import { evaluateConcept } from './api';
import { concat } from 'lodash';

import { flashCardMachine, transitions, states } from './machines';

export const reviewService = ({
  cards = [],
} = {}) => {
 
  const saveReviewToAPI = async ({ context, event: { review } }) => {
    return evaluateConcept({
      ...review
    })
  };

  function getCardsToReview({ context }) {
    const { cards } = context;
    const result = (cards || [])
    .sort((a, b) => a.review.dueDate.isBefore(b.review.dueDate))
    .filter(card => card.review.dueDate.isBefore(tomorrow()))

    return result
  }

  function shuffleDrawPile({ context, event }) {
    const drawPile = context.drawPile;
    if (!context.enableShuffle) {
      return drawPile
    }
    return drawPile.slice(1).concat(drawPile[0]);
  }

  function isFinished({ context, event }) {
    const { cards } = context;
    return cards.every(card => card.review.dueDate.isAfter(tomorrow()));
  }

  function handleResponse({ context, event }) {
    if (context.lastCard) {
      context.lastCard.review = normalizeReviewClient({ review: event.data.review })
    }

    return {
      ...context,
      cards: concat(context.cards, normalizeCardClient({ createdCards: event.data.createdCards }))
    }
  }
  const initialCards = getCardsToReview({ context: { cards } }) || [];

  const { state, send, service } = useMachine(flashCardMachine, {
    context: {
      cards: initialCards,
      cardFinishCallback: saveReviewToAPI,
      shuffleDrawPile,
      handleResponse,
      fetchDrawPile: getCardsToReview,
      isFinished,
    },
  });


  const step = derived(
    state,
    $state => stateIndex($state.value)
  );

  const context = derived(
    state,
    $state => $state.context
  );

  const onReview = (review) => {
    send(transitions.REVIEWED, { review });
  }

  return {
    onReview,
    transitions,
    states,
    step,
    context,
    send,
    service,
  };
}

