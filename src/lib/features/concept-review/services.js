import { useMachine } from '$lib/features/utilities.js';
import { stateIndex } from '$lib/features/utilities.js';
import { derived } from 'svelte/store'
import { Card,  } from './utilities'
// import { tomorrow } from './utilities';
// import { evaluateConcept } from './api';

import { flashCardMachine, transitions, states } from './machines';

export const reviewService = ({
  cards = [],
} = {}) => {

  // const saveReviewToAPI = async ({ context, event: { review } }) => {
  //   debugger
  //   return evaluateConcept({
  //     ...review
  //   })
  // };

  // function getCardsToReview({ context, event }) {
  //   debugger
  //   const { cards } = context;

  //   return cards
  //     .sort((a, b) => a.dueDate.isBefore(b.dueDate))
  //     .filter(card => card.dueDate.isBefore(tomorrow()));
  // }

  const { state, send, service } = useMachine(flashCardMachine, {
    context: {
      cards: cards.map(card => new Card(card)),
      // cardFinishCallback: saveReviewToAPI,
      // getDrawPileCallack: getCardsToReview,
    }
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

    console.log(review)


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

