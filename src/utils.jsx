const gameStateMeaning = {
	playerXWins: 0,
	playerOWins: 1,
	draw: 2,
	inProgress: 3,
}

export {gameStateMeaning};

const getRandomNumber = (start, end) => {
  let random = Math.floor(Math.random() * end + start);
  while (random > end) {
    random = Math.floor(Math.random() * end + start);
  }
  return random;
};

export { getRandomNumber };