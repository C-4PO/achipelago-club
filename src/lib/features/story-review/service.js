import { flashCardMachine } from './machines';
import { derived } from 'svelte/store'
import { stateIndex } from '$lib/features/utilities.js';
import { useMachine } from '$lib/features/utilities.js';

export const reviewService = (initialState) => {
  const { state, send, service } = useMachine(flashCardMachine, {
    context: {
      ...initialState,
      currentCardIndex: 0,
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

  const cards = derived(
    state,
    $state => $state.context.cards
  );

  return {
    step,
    context,
    cards,
    send,
    service,
  };
}