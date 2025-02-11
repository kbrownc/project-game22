import {gameStateMeaning} from "../utils";

function GameOver( { gameState } ) {
  switch(gameState) {
    case gameStateMeaning.inProgress:
      return <></>
    case gameStateMeaning.playerOWins:
      return <div className="game-over">O Wins</div>
    case gameStateMeaning.playerXWins:
      return <div className="game-over">X Wins</div>
    case gameStateMeaning.draw:
      return <div className="game-over">Draw</div>
    default:
      return <></>
  }
}

export default GameOver;
