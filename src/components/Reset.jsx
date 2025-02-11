import {gameStateMeaning} from "../utils";

function Reset( { gameState, onReset } ) {
  if (gameState === gameStateMeaning.inProgress) {
    return;
  }

  return <button onClick={onReset} className="reset-button">Reset</button>;
}

export default Reset;
