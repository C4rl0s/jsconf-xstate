// External dependencies
import { createMachine } from 'xstate';

// Show all createMachine features
// createMachine creates the blueprint of the machine
console.log(createMachine);

const elBoton = document.querySelector('#the-button');
const texttoDelBoton = document.querySelector('#output');

function output(currentStateText) {
    texttoDelBoton.innerHTML = currentStateText;
  }

  const machine = createMachine({
    // Add your object machine definition here
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
  });


console.log('machine', machine);

// Initial state inactive
let currentState = machine.initial;

output(currentState);

function send(event) {
  // Determine and update the `currentState`
  currentState = machine.transition(currentState, event);

  elBoton.dataset.state = currentState.value;
  
  output(currentState.value);
};

window.send = send;

elBoton.addEventListener("mouseenter", () => {
  send('MOUSEENTER');
});

elBoton.addEventListener("mouseleave", () => {
    send('MOUSELEAVE');
  });
