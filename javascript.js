playGame();

function playGame() {
  const gameController = GameController();

  let gameState = gameController.getGameState();
  while (gameState.gameStatus === 'running') {
    printBoard();
    console.log(`It is currently ${gameState.currentPlayer}'s turn!`);
    
    let selectedIndex = prompt('Choose a slot:');
    while (!gameController.playRound(selectedIndex)) {
      selectedIndex = prompt('Try again:');
    }
    gameState = gameController.getGameState();
  }
  printBoard();
  switch (gameState.gameStatus) {
    case 'win':
      console.log(`${gameState.currentPlayer} won!`);
      break;
    case 'tie':
      console.log('It\'s a tie!');
      break;
    default:
      break;
  }

  function printBoard() {
    const board = gameController.getGameState().currentBoard;
    console.log(
        `${board[0] || 0} ${board[1] || 1} ${board[2] || 2}\n` +
        `${board[3] || 3} ${board[4] || 4} ${board[5] || 5}\n` +
        `${board[6] || 6} ${board[7] || 7} ${board[8] || 8}`
    );
  }
}

function Gameboard() {
  const board = Array(9).fill(null);

  function addMark(index, { token }) {
    if (index < 9 && index >= 0 && board[index] === null) {
      board[index] = token;
      return true;
    }
    return false;
  }

  function getBoard() {
    return [...board];
  }
  
  function checkWin({ token }) {
    const threeInARow = token.repeat(3);
    for (let i = 0; i < 3; i += 3) {
      const rowHasNoEmptySlots = board[i] && board[i + 1] && board[i + 2];
      const rowIsFilledWithSameToken = (board[i] + board[i + 1] + board[i + 2]) === threeInARow;
      if (rowHasNoEmptySlots && rowIsFilledWithSameToken) {
        return true;
      }
    }
    for (let i = 0; i < 3; ++i) {
      const colHasNoEmptySlots = board[i] && board[i + 3] && board[i + 6];
      const colIsFilledWithSameToken = (board[i] + board[i + 3] + board[i + 6]) === threeInARow;
      if (colHasNoEmptySlots && colIsFilledWithSameToken) {
        return true;
      }
    }
    if (board[0] && board[4] && board[8] && (board[0] + board[4] + board[8]) === threeInARow) {
      return true;
    }

    if (board[2] && board[4] && board[6] && (board[2] + board[4] + board[6]) === threeInARow) {
      return true;
    }

    return false;
  }

  return {
    addMark,
    getBoard,
    checkWin,
  };
}

function GameController(player1 = 'P1', player2 = 'P2') {
  let gameStatus = 'running';
  const board = Gameboard();
  const players = [
    {
      name: player1,
      token: 'X',
    },
    {
      name: player2,
      token: 'O',
    },
  ];

  let currentPlayer = players[0];

  function getGameState() {
    return {
      gameStatus,
      currentPlayer: currentPlayer.name,
      currentBoard: board.getBoard(),
    };
  }
  
  function playRound(index) {
    if (gameStatus === 'running' && board.addMark(index, currentPlayer)) {
      const boardIsFull = !board.getBoard().includes(null);
      const playerHasWon = board.checkWin(currentPlayer);

      if (playerHasWon) {
        gameStatus = 'win';
      } else if (boardIsFull) {
        gameStatus = 'tie';
      } else {
        currentPlayer = (currentPlayer === players[0]) ? players[1] : players[0];
      }
      return true;
    }
    return false;
  }

  return {
    playRound,
    getGameState,
  }
}

