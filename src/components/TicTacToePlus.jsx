import { useState, useEffect } from 'react';
import Board from './Board';
import GameOver from './GameOver';
import { gameStateMeaning } from '../utils';
//import { getRandomNumber } from '../utils';
import Reset from './Reset';

const PLAYER_X = 'X';
const PLAYER_O = 'O';
const PLAYER_Blocked = 'Blocked';

const winningCombinations = [
  { combo: [0, 1, 2], strikeClass: 'strike-row-1' },
  { combo: [3, 4, 5], strikeClass: 'strike-row-2' },
  { combo: [6, 7, 8], strikeClass: 'strike-row-3' },
  { combo: [0, 3, 6], strikeClass: 'strike-column-1' },
  { combo: [1, 4, 7], strikeClass: 'strike-column-2' },
  { combo: [2, 5, 8], strikeClass: 'strike-column-3' },
  { combo: [0, 4, 8], strikeClass: 'strike-diagonal-1' },
  { combo: [2, 4, 6], strikeClass: 'strike-diagonal-2' },
];

function checkWinner(tiles, setStrikeClass, setGameState) {
  for (const { combo, strikeClass } of winningCombinations) {
    const tileValue1 = tiles[combo[0]];
    const tileValue2 = tiles[combo[1]];
    const tileValue3 = tiles[combo[2]];

    if (tileValue1 !== null && tileValue1 === tileValue2 && tileValue1 === tileValue3) {
      setStrikeClass(strikeClass);
      if (tileValue1 === PLAYER_X) {
        setGameState(gameStateMeaning.playerXWins);
      } else {
        setGameState(gameStateMeaning.playerOWins);
      }
      return;
    }
  }
  // Is this coded xorrectly using occurance 0 ????????????????????????????????????????
  const areAllTilesFilledIn = tiles[0].every(tile => tile !== null);
  if (areAllTilesFilledIn) {
    setGameState(gameStateMeaning.draw);
  }
}

function TicTacToePlus() {
  const initialTiles = [[null,"Play","Skip","Switch","Blocked"],
                        [null,"Skip","Switch","Blocked"],
                        [null,"Switch","Blocked"],
                        [null,"Blocked"],
                        [null],
                        [null],
                        [null],
                        [null],
                        [null]]
  //const [tiles, setTiles] = useState(Array(9).fill(null));
  //let randomNum = getRandomNumber(1, 99);
  const [tiles, setTiles] = useState(initialTiles);
  const [playerTurn, setPlayerTurm] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState();
  const [gameState, setGameState] = useState(gameStateMeaning.inProgress);

  const handleTileClick = index => {
    console.log(index, tiles)
    if (gameState !== gameStateMeaning.inProgress) {
      return;
    }
    if (tiles[index][0] === PLAYER_X || tiles[index][0] === PLAYER_O) {
      return;
    }
    const newTiles = [...tiles];

    if (tiles[index][1] === 'Skip') {
      console.log(tiles[index])
      newTiles[index].splice(1, 1);
    } else if (tiles[index][1] === 'Switch') {
      console.log(tiles[index][0]);
      if (playerTurn === PLAYER_X) {
        newTiles[index][0] = PLAYER_O
      } else {
        newTiles[index][0] = PLAYER_X
      }
      newTiles[index].splice(1, 1);
    } else if (tiles[index][1] === 'Blocked') {
      console.log(tiles[index][0]);
      newTiles[index][0] = PLAYER_Blocked;
      newTiles[index].splice(1, 1);
    } else if (tiles[index][1] === 'Play') {
      console.log(newTiles[index])
      newTiles[index][0] = playerTurn;
      newTiles[index].splice(1, 1);
    }

    setTiles(newTiles);
    if (playerTurn === 'X') {
      setPlayerTurm(PLAYER_O);
    } else {
      setPlayerTurm(PLAYER_X);
    }
  };

  const handleReset = () => {
    setGameState(gameStateMeaning.inProgress);
    setTiles(initialTiles);
    setPlayerTurm(PLAYER_X);
    setStrikeClass(null);
  };

  useEffect(() => {
    checkWinner(tiles, setStrikeClass, setGameState);
  }, [tiles]);

  return (
    <div>
      <h1>Tic Tac Toe Plus</h1>
      <Board playerTurn={playerTurn} tiles={tiles} onTileClick={handleTileClick} strikeClass={strikeClass} />
      <GameOver gameState={gameState} />
      <Reset gameState={gameState} onReset={handleReset} />
    </div>
  );
}

export default TicTacToePlus;
