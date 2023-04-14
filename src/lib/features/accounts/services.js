
import { authMachine, states, transitions } from "./machines";
import { useMachine } from "@xstate/svelte";
import { stateIndex } from '$lib/features/utilities';
import { derived } from "svelte/store";

export const authService = (initialState) => {
  const { state, send, service } = useMachine(authMachine, {
    context: {
      ...initialState,
    },
  });

  const step = derived(state, ($state) => stateIndex($state.value));

  const context = derived(state, ($state) => $state.context);

  const login = () => send(transitions.LOGIN);
  const signup = () => send(transitions.SIGNUP);
  const submit = (payload) => send(transitions.SUBMIT, payload);
  const retry = () => send(transitions.RETRY);

  return {
    step,
    states,
    context,
    login,
    signup,
    submit,
    retry,
    service,
  };
}