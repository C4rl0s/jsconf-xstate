const elBoton = document.querySelector('#the-button');
const texttoDelBoton = document.querySelector('#output');

function output(currentStateText) {
    texttoDelBoton.innerHTML = currentStateText;
  }

// create machine with object
const transitionMachine = {
  initial: "inactive",
  states: {
    inactive: {
      on: {
        MOUSEENTER: 'active'
      }
    },
    active: {
      on:{
        MOUSELEAVE: 'inactive'
      }
    },
  },
};

const objectTransition = (state, event) => {
  console.log('objectTransition', state, event)
  return transitionMachine.states[state]?.on?.[event] || state;
};

// Keep track of your current state (switch)
//let currentState = transition("pending", "inactive");

// Initial state inactive
let currentState = 'inactive';
output(currentState);

function send(event) {
  console.log("send event", event);
  // Determine the next value of `currentState`
  //let nextState = transition(currentState, event);
  let nextState = objectTransition(currentState, event);
  console.log("send nextState", nextState);

  currentState = nextState;
  console.log("currentState in send", currentState);
  //return currentState = nextState;
  elBoton.dataset.state = currentState;
  output(currentState);
};

window.send = send;

elBoton.addEventListener("mouseenter", () => {
  send('MOUSEENTER');
});

elBoton.addEventListener("mouseleave", () => {
    send('MOUSELEAVE');
  });
