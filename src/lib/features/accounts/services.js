
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
  const stageIndex = derived(context, ($context) => $context.stageIndex);

  const login = () => {
    console.log(`hefwefwhe`)
    send(transitions.LOGIN);
  }
  const signup = () => {
    console.log(`hwheeeeee`)
    send(transitions.SIGNUP);
  }
  const submit = (payload) => send(transitions.SUBMIT, payload);
  const retry = () => send(transitions.RETRY);


  return {
    stageIndex,
    step,
    send,
    states,
    context,
    login,
    signup,
    submit,
    retry,
    service,
  };
}