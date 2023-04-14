import { createMachine, assign } from "xstate";

const loginService = async (context, event) => {
  // Your login logic with a Promise
              // Your login logic with a Promise
            };
const signupService = async (context, event) => {
  // Your signup logic with a Promise
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
    error: "error",
    success: "success",
  },
  signup: {
    id: "signup",
    form: "form",
    termsAndConditions: "termsAndConditions",
    loading: "loading",
    error: "error",
    success: "success",
  },
};

export const authMachine = createMachine(
  {
    id: "auth",
    initial: states.chooseOption,
    context: {
      errorContext: null,
    },
    states: {
      [states.chooseOption]: {
        on: {
          [transitions.LOGIN]: states.login.id,
          [transitions.SIGNUP]: states.signup.id,
        },
      },
      [states.login.id]: {
        initial: states.login.form,
        states: {
          [states.login.form]: {
            on: {
              [transitions.SIGNUP]: `../../${states.signup.id}/${states.signup.form}`,
              [transitions.SUBMIT]: {
                target: states.login.loading,
                cond: "hasCredentials",
              },
            },
          },
          [states.login.loading]: {
            invoke: {
              src: loginService,
              onDone: {
                target: states.login.success,
                actions: assign({ user: (context, event) => event.data }),
              },
              onError: {
                target: states.login.error,
              },
            },
          },
          [states.login.error]: {
            on: {
              [transitions.RETRY]: states.login.form,
            },
          },
          [states.login.success]: {
            type: "final",
          },
        },
      },
      [states.signup.id]: {
        initial: states.signup.form,
        states: {
          [states.signup.form]: {
            on: {
              [transitions.LOGIN]: `../../${states.login.id}/${states.login.form}`,
              [transitions.SUBMIT]: {
                target: states.signup.loading,
                cond: "hasCredentials",
              },
              [transitions.TERMS_AND_CONDITIONS]: states.signup.termsAndConditions,
            },
          },
          [states.signup.loading]: {
            invoke: {
              src: signupService,
              onDone: {
                target: states.signup.success,
                actions: assign({ user: (context, event) => event.data }),
              },
              onError: {
                target: states.signup.error,
              },
            },
          },
          [states.signup.error]: {
            on: {
              [transitions.RETRY]: states.signup.form,
            },
          },
          [states.signup.success]: {
            type: "final",
          },
          [states.signup.termsAndConditions]: {
            on: {
              [transitions.SIGNUP]: states.signup.form,
            },
          },
        },
      },
    },
  },
  {
    guards: {
      hasCredentials: (context, event) => {
        debugger
        return event.username && event.password;
      },
    },
  }
);
            