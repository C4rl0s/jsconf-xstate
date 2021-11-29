const elBoton = document.querySelector('#the-button');
const texttoDelBoton = document.querySelector('#output');

function output(currentStateText) {
    texttoDelBoton.innerHTML = currentStateText;
  }

// Pure function that returns the next state,
// given the current state and sent event
function transition(state, event) {
  console.log("in transition", state, event);
  switch (state) {
    // Add your state/event transitions here
    // to determine and return the next state
    case "inactive":
      switch (event) {
        case "MOUSEENTER":
          return "active";
        default:
          return state;
      }
    case "active":
      switch (event) {
        case "MOUSELEAVE":
          return "inactive";
        default:
          return state;
      }
    case "inactive":
    case "active":
    default:
      return state;
  }
};

// Keep track of your current state (switch)
let currentState = transition("inactive", "pending");
output(currentState);

function send(event) {
  console.log("send event", event);
  // Determine the next value of `currentState`
  let nextState = transition(currentState, event);
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
