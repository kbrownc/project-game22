import { useState, useEffect } from 'react';
import Board from './Board';
import GameOver from './GameOver';
import { gameStateMeaning } from '../utils';
import { getRandomNumber } from '../utils';
import Reset from './Reset';

const PLAYER_X = 'X';
const PLAYER_O = 'O';
const PLAYER_Blocked = 'Blocked';
const PLAYER_Wild = 'Wild';
const PLAYER_Remove = 'Remove';
const PLAYER_Switch = 'Switch';
const PLAYER_Play = 'Play';
const PLAYER_Skip = 'Skip';
//debugger; // eslint-disable-line

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

const getPlayerMove = () => {
    let playerMove = '';
    let randomNum = getRandomNumber(1, 15);
    if (randomNum < 10) {
      playerMove = PLAYER_Play
    } else if (randomNum === 10) {
      playerMove = PLAYER_Wild
    } else if (randomNum === 11) {
      playerMove = PLAYER_Blocked
    } else if (randomNum === 12) {
      playerMove = PLAYER_Switch
    } else if (randomNum === 13) {
      playerMove = PLAYER_Skip
    } else if (randomNum > 13) {
      playerMove = PLAYER_Remove
    }
    return playerMove;
  };

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
    } else {
      const areAllTilesFilledIn = tiles.every(tile => tile[0] !== null);
      if (areAllTilesFilledIn) {
        setGameState(gameStateMeaning.draw);
      }
    }
  }
}

function TicTacToePlus() {
  const [tiles, setTiles] = useState([[null],[null],[null],[null],[null],[null],[null],[null],[null]]);
  const [message, setMessage] = useState('');
  const [switchXO, setSwitchXO] = useState(false);
  const [removeXO, setRemoveXO] = useState(false);
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState();
  const [gameState, setGameState] = useState(gameStateMeaning.inProgress);

  const handleTileClick = index => {
    console.log(tiles)
    // If game is not in progress, exit
    if (gameState !== gameStateMeaning.inProgress) return;
    const newTiles = [...tiles];
    let workMessage = ''
    let workPlayerTurn = playerTurn;
    playerTurn === 'X' ? workPlayerTurn = PLAYER_O : workPlayerTurn =  PLAYER_X;
    workMessage = workPlayerTurn + ', your turn to play'

    // Process standard click on a square
    if (!removeXO && !switchXO) {
      // exit if square already has been played in
      if (tiles[index][0] !== null) {
        workMessage = 'Cannot play if a value alreay exists in square'
        setMessage(workMessage)
        return
      };
      // If spot clicked on doesnt have an action move, get one
      if (tiles[index][1] === null || tiles[index][1] === undefined) {
        newTiles[index][1] = getPlayerMove()
        console.log('obtained another move: ' + newTiles[index][1])
      }
      // If player move is 'remove' or 'switch', ensure there is a valid move...
      //    if not assure PLAY is current move
      if (newTiles[index][1] === PLAYER_Remove || tiles[index][1] === PLAYER_Switch) {
        let notCurrrentPlayer = '';
        playerTurn === PLAYER_X ? notCurrrentPlayer = PLAYER_O : notCurrrentPlayer = PLAYER_X;
        if (tiles.every(tile => tile[0] !== notCurrrentPlayer)) {
          newTiles[index].splice(1, 1);
          newTiles[index][1] = PLAYER_Play;
        }
      }
      if (tiles[index][1] === PLAYER_Skip) {
        newTiles[index].splice(1, 1);
      } else if (tiles[index][1] === PLAYER_Switch) {
        setSwitchXO(true)
        workMessage = playerTurn + ', Pick a square and switch the choice';
        newTiles[index].splice(1, 1);
      } else if (tiles[index][1] === PLAYER_Remove) {
        setRemoveXO(true)
        workMessage = playerTurn + ', Pick a square and remove the contents';
        newTiles[index].splice(1, 1);
      } else if (tiles[index][1] === 'Blocked') {
        newTiles[index][0] = PLAYER_Blocked;
        newTiles[index].splice(1, 1);
      } else if (tiles[index][1] === 'Wild') {
        newTiles[index][0] = PLAYER_Wild;
        newTiles[index].splice(1, 1);
      } else if (tiles[index][1] === 'Play') {
        newTiles[index][0] = playerTurn;
        newTiles[index].splice(1, 1);
      }
      setPlayerTurn(workPlayerTurn);
    }

    // Process click on a square after you have found a switch or remove
    if (removeXO || switchXO) {
      // exit if what already exists in square is not an X or O
      if (tiles[index][0] !== PLAYER_X && tiles[index][0] !== PLAYER_O) {
        workMessage = 'Can only remove an X or O'
        setMessage(workMessage)
        return
      };
      if (switchXO) {
        setSwitchXO(false)
        newTiles[index][0] = playerTurn;
        newTiles[index].splice(1, 1);
      } else if (removeXO) {
        setRemoveXO(false)
        newTiles[index][0] = null;
        newTiles[index].splice(1, 1);
      }
    }
    setTiles(newTiles);
    setMessage(workMessage)
  };

  const handleReset = () => {
    setGameState(gameStateMeaning.inProgress);
    let initialTiles = [[null],[null],[null],[null],[null],[null],[null],[null],[null]]
    for (let i = 0; i < 9; i++) {
      initialTiles[i][1] = getPlayerMove()
    }
    setTiles(initialTiles);
    setPlayerTurn(PLAYER_X);
    setStrikeClass();
    setMessage('');
    setSwitchXO(false);
    setRemoveXO(false);
  };

  useEffect(() => {
    checkWinner(tiles, setStrikeClass, setGameState);
  }, [tiles]);

  useEffect(() => {
    let initialTiles = [[null],[null],[null],[null],[null],[null],[null],[null],[null]]
    for (let i = 0; i < 9; i++) {
      initialTiles[i][1] = getPlayerMove()
    }
    setTiles(initialTiles);
  }, []);

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
