// External dependencies
import { createMachine, interpret, assign } from "xstate";

const elEmailInput = document.querySelector("#email");
const elSecretInput = document.querySelector("#secret");
const elBoton = document.querySelector("#the-button");
const texttoDelBoton = document.querySelector("#output");

function output(currentStateText) {
  texttoDelBoton.innerHTML = currentStateText;
}

const emailIsValid = (context, event) => {
  console.log("event?.email", event?.email);
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  console.log("regex val", emailRegex.test(String(event?.email).toLowerCase()));
  return emailRegex.test(String(event?.email).toLowerCase());
};

const secretIsValid = (context, event) => {
  console.log("secretIsValid context", context);
  console.log("secretIsValid event", event.secret.length);
  console.log('secretIsValid', event.secret.length > 7);
  return event?.secret?.length > 7;
};

const isValidForm = () => {
  return emailIsValid && secretIsValid;
};

console.log('secretIsValid', secretIsValid);

const signupMachine = createMachine(
  {
    // Add your object machine definition here
    id: "signup",
    initial: "editing",
    context: {
      email: "",
      secret: "",
      error: null,
    },
    states: {
      editing: {
        on: {
          CHANGE_EMAIL: {
            actions: "changeEmail",
            cond: emailIsValid,
          },
          CHANGE_SECRET: {
            actions: "changeSecret",
            cond: secretIsValid,
          },
          SUBMIT: "submitting",
          VALIDATE: 'validating',
        },
      },
      submitting: {
        invoke: {
          src: "submit",
          onDone: {
            target: "success",
          },
          onError: {
            target: "failure",
            actions: "setError",
          },
        },
      },
      validating: {
        on: {
          VALIDATE: {
            cond: isValidForm,
            target: 'editing', 
          },
        }
      },
      success: {
        type: "final",
      },
      failure: {
        on: {
          CHANGE_EMAIL: {
            target: "editing",
            actions: ["changeEmail", "clearError"],
          },
          CHANGE_SECRET: {
            target: "editing",
            actions: ["changeSecret", "clearError"],
          },
          VALIDATE: {
            target: 'editing',
            actions: ['validateForm'],
          },
        },
      },
    },
  },
  {
    actions: {
      changeEmail: {
        email: assign({
          email: (_ctx, evt) => evt.value,
        }),
      },
      changeSecret: {
        secret: assign({
          secret: (_ctx, evt) => evt.value,
        }),
      },
      validateForm: {
        isValidForm,
      },
      setError: assign({
        error: (_ctx, evt) => evt.data,
      }),
      clearError: assign({
        error: (_ctx, _evt) => null,
      }),
    },
    services: {
      submit: (_ctx, _evt) =>
        new Promise(async (resolve, reject) => {
          function timeout(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
          }
          await timeout(3000);
          const rand = Math.random();
          if (rand < 0.5) {
            reject("failed to signup");
          } else {
            resolve("user secret data");
          }
        }),
    },
  }
);

const serviceSignup = interpret(signupMachine);

let currentState = serviceSignup.machine.initial;

output(currentState);

console.log('initial currentState', currentState);

console.log("serviceSignup", serviceSignup);

serviceSignup.onTransition((state) => {
  console.log("state on transition", state.value);
  currentState = state.value;
  console.log('currentState onTransition', currentState);
  elEmailInput.dataset.state = currentState;
  elSecretInput.dataset.state = currentState;
  elBoton.dataset.state = currentState;
  output(currentState);
});

serviceSignup.start();

elEmailInput.addEventListener("blur", () => {
  serviceSignup.send({
    type: "CHANGE_EMAIL",
    email: elEmailInput.value,
  });
});

elSecretInput.addEventListener("blur", () => {
  console.log('el secreto');
  serviceSignup.send({
    type: "CHANGE_SECRET",
    secret: elSecretInput.value,
  });

  serviceSignup.send({
    type: "VALIDATE",
  });
});

elBoton.addEventListener('click', (event) => {
  console.log('event elBoton', event);
});
elBoton.addEventListener('click', (event) => {
  console.log('event elBoton', event);
});
