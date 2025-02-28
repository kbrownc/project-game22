import { useState, useEffect } from 'react';
import Board from './Board';
import GameOver from './GameOver';
import { gameStateMeaning } from '../utils';
//import { getRandomNumber } from '../utils';
import Reset from './Reset';

const PLAYER_X = 'X';
const PLAYER_O = 'O';
const PLAYER_Blocked = 'Blocked';
const PLAYER_Wild = 'Wild';

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
    const tileValue1 = tiles[combo[0]][0];
    const tileValue2 = tiles[combo[1]][0];
    const tileValue3 = tiles[combo[2]][0];
    let tempSolution = [];

    if (tileValue1 !== PLAYER_Wild) tempSolution.push(tileValue1);
    if (tileValue2 !== PLAYER_Wild) tempSolution.push(tileValue2);
    if (tileValue3 !== PLAYER_Wild) tempSolution.push(tileValue3);
    let haveWinner = false;
    
    if (tempSolution.includes(PLAYER_Blocked)) continue;
    if (tempSolution.includes(null)) continue;
    if (tempSolution.length === 0) continue;
    if (tempSolution.length === 1) {
      haveWinner = true;
    } else if (tempSolution.length === 2 && tempSolution[0] === tempSolution[1]) {
      haveWinner = true;
    } else if (tempSolution[0] === tempSolution[1] && tempSolution[0] === tempSolution[2]) {
      haveWinner = true;
    }

    if (haveWinner) {
      setStrikeClass(strikeClass);
      if (tileValue1 === PLAYER_X || tileValue2 === PLAYER_X || tileValue3 === PLAYER_X) {
        setGameState(gameStateMeaning.playerXWins);
      } else if (tileValue1 === PLAYER_O || tileValue2 === PLAYER_O || tileValue3 === PLAYER_O) {
        setGameState(gameStateMeaning.playerOWins);
      }
    }
    
  }
  const areAllTilesFilledIn = tiles.every(tile => tile[0] !== null);
  if (areAllTilesFilledIn) {
    setGameState(gameStateMeaning.draw);
  }
}

function TicTacToePlus() {
  const initialTiles = [[null,"Play"],
                        [null,"Skip","Blocked"],
                        [null,"Switch","Play"],
                        [null,"Blocked"],
                        [null,"Play"],
                        [null,"Wild"],
                        [null,"Play"],
                        [null,"Play"],
                        [null,"Play"]];
  //const [tiles, setTiles] = useState(Array(9).fill(null));
  //let randomNum = getRandomNumber(1, 99);
  const [tiles, setTiles] = useState(initialTiles);
  const [message, setMessage] = useState('');
  const [switchXO, setSwitchXO] = useState(false);
  const [playerTurn, setPlayerTurm] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState();
  const [gameState, setGameState] = useState(gameStateMeaning.inProgress);

  const handleTileClick = index => {
    if (gameState !== gameStateMeaning.inProgress) {
      return;
    }
    //debugger; // eslint-disable-line

    if (!switchXO) {
      if (tiles[index][0] === PLAYER_X || tiles[index][0] === PLAYER_O) {
        return;
      }
    } else {
      if (tiles[index][0] !== PLAYER_X && tiles[index][0] !== PLAYER_O) {
        return;
      }
    }

    const newTiles = [...tiles];
    let workSwitchXO = switchXO;
    setMessage('');

    if (tiles[index][1] === 'Skip') {
      console.log('skip',tiles[index])
      newTiles[index].splice(1, 1);
    } else if (tiles[index][1] === 'Switch') {
      console.log('switch',tiles[index]);
      workSwitchXO = true
      setMessage('Pick a square and switch the choice');
      playerTurn === PLAYER_X ? newTiles[index][0] = PLAYER_O : newTiles[index][0] = PLAYER_X
      newTiles[index].splice(1, 1);
    } else if (tiles[index][1] === 'Blocked') {
      console.log('blocked',tiles[index]);
      newTiles[index][0] = PLAYER_Blocked;
      newTiles[index].splice(1, 1);
    } else if (tiles[index][1] === 'Wild') {
      console.log('wild',tiles[index]);
      newTiles[index][0] = PLAYER_Wild;
      newTiles[index].splice(1, 1);
    } else if (tiles[index][1] === 'Play') {
      console.log('play',tiles[index])
      newTiles[index][0] = playerTurn;
      newTiles[index].splice(1, 1);
    } else if (workSwitchXO) {
      console.log('switchXO',newTiles[index],switchXO)
      workSwitchXO = false
      newTiles[index][0] = playerTurn;
      newTiles[index].splice(1, 1);
    }

    setTiles(newTiles);
    if (!workSwitchXO) {
        playerTurn === 'X' ? setPlayerTurm(PLAYER_O) : setPlayerTurm(PLAYER_X)
     }
     setSwitchXO(workSwitchXO) 
  };

  const handleReset = () => {
    setGameState(gameStateMeaning.inProgress);
    setTiles(initialTiles);
    setPlayerTurm(PLAYER_X);
    setStrikeClass();
    setMessage('');
    setSwitchXO(false);
  };

  useEffect(() => {
    checkWinner(tiles, setStrikeClass, setGameState);
  }, [tiles]);

  return (
    <div>
      <h1>Tic Tac Toe Plus</h1>
      <p>{message}</p>
      <Board playerTurn={playerTurn} tiles={tiles} onTileClick={handleTileClick} strikeClass={strikeClass} />
      <GameOver gameState={gameState} />
      <Reset gameState={gameState} onReset={handleReset} />
    </div>
  );
}

export default TicTacToePlus;
