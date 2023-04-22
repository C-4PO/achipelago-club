import { useMachine } from '$lib/features/utilities.js';
import { stateIndex } from '$lib/features/utilities.js';
import { derived } from 'svelte/store'
import { Card } from './utilities'

import { flashCardMachine, transitions, states } from './machines';

export const reviewService = ({
  cards = [],
} = {}) => {

  const { state, send, service } = useMachine(flashCardMachine, {
    context: {
      cards: cards.map(card => new Card(card)),
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

  return {
    transitions,
    states,
    step,
    context,
    send,
    service,
  };
}

