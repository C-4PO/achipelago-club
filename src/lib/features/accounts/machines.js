import { createMachine, assign } from "xstate";
import { signup, login } from "./api";

const loginService = async (context, event) => {
  return login(event);
};
const signupService = async (context, event) => {
  return signup(event);
};

export const transitions = {
  LOGIN: "LOGIN",
  SIGNUP: "SIGNUP",
  TERMS_AND_CONDITIONS: "TERMS_AND_CONDITIONS",
  SUBMIT: "SUBMIT",
  RETRY: "RETRY",
};

export const states = {
  chooseOption: "chooseOption",
  login: {
    id: "login",
    form: "form",
    loading: "loading",
    success: "success",
  },
  signup: {
    id: "signup",
    form: "form",
    termsAndConditions: "termsAndConditions",
    loading: "loading",
    success: "success",
  },
};

export const authMachine = createMachine(
  {
    id: "auth",
    edictableActionArguments: true,
    initial: states.chooseOption,
    context: {
      errorContext: null,
      stageIndex: 1,
    },
    states: {
      [states.chooseOption]: {
        entry: assign({ stageIndex: 0 }),
        on: {
          [transitions.LOGIN]: states.login.id,
          [transitions.SIGNUP]: states.signup.id,
        },
      },
      [states.login.id]: {
        entry: assign({ stageIndex: 1 }),
        initial: states.login.form,
        states: {
          [states.login.form]: {
            id: "login-form",
            on: {
              [transitions.SIGNUP]: `#signup-form`,
              [transitions.SUBMIT]: {
                target: states.login.loading,
              },
            },
          },
          [states.login.loading]: {
            entry: assign({ stageIndex: 2 }),
            invoke: {
              src: loginService,
              onDone: {
                target: states.login.success,
                actions: assign({ user: (context, event) => event.data }),
              },
              onError: {
                target: states.login.form,
              },
            },
          },
          [states.login.success]: {
            entry: assign({ stageIndex: 3 }),
            type: "final",
          },
        },
      },
      [states.signup.id]: {
        initial: states.signup.form,
        states: {
          [states.signup.form]: {
            id: "signup-form",
            entry: assign({ stageIndex: 4 }),
            on: {
              [transitions.LOGIN]: `#login-form`,
              [transitions.SUBMIT]: {
                target: states.signup.loading,
              },
              [transitions.TERMS_AND_CONDITIONS]: states.signup.termsAndConditions,
            },
          },
          [states.signup.loading]: {
            entry: assign({ stageIndex: 5 }),
            invoke: {
              src: signupService,
              onDone: {
                target: states.signup.success,
                actions: assign({ user: (context, event) => event.data }),
              },
              onError: {
                target: states.signup.form,
              },
            },
          },
          [states.signup.success]: {
            entry: assign({ stageIndex: 6 }),
            type: "final",
          },
          [states.signup.termsAndConditions]: {
            entry: assign({ stageIndex: 7 }),
            on: {
              [transitions.SIGNUP]: states.signup.form,
            },
          },
        },
      },
    },
  },
);
