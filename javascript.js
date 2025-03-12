const gameController = GameController();


function Gameboard() {
  const board = Array(9).fill(null);

  function addMark(index, { token }) {
    if (index < 9 && index >= 0 && board[index] === null) {
      board[index] = token;
      return true;
    }
    return false;
  }

  function printBoard() {
    console.log(
        `${board[0] || 0} ${board[1] || 1} ${board[2] || 2}\n` +
        `${board[3] || 3} ${board[4] || 4} ${board[5] || 5}\n` +
        `${board[6] || 6} ${board[7] || 7} ${board[8] || 8}`
    );
  }

  function getBoard() {
    return [...board];
  }

  function checkWin(index, { token }) {
    if (index > 9 || index < 0) {
      return null;
    }
    if (checkDiagonals(index, token) || checkStraights(index, token)) {
      return true;
    }
    return false
  }

  function checkDiagonals(index, token) {
    const tokenLine = token + token + token;
    if (index % 2 === 1) {
      return false;
    }
    let isFallingDiagonal = (tokenLine === board[0] + board[4] + board[8]);
    let isRisingDiagonal = (tokenLine === board[2] + board[4] + board[6]);

    switch (index) {
      case 0:
      case 8:
        return isFallingDiagonal;
      case 2:
      case 6:
        return isRisingDiagonal;
      case 4:
        return isFallingDiagonal || isRisingDiagonal;
    }
  }

  function checkStraights(index, token) {
    const tokenLine = token + token + token;
    let vertical = false;
    let horizontal = false;

    if ([0, 1, 2].includes(index)) {
      vertical = (tokenLine === board[index] + board[index + 3] + board[index + 6]);
    } else if ([3, 4, 5].includes(index)) {
      vertical = (tokenLine === board[index] + board[index - 3] + board[index + 3]);
    } else if ([6, 7, 8].includes(index)) {
      vertical = (tokenLine === board[index] + board[index - 3] + board[index - 6]);
    }

    if ([0, 3, 6].includes(index)) {
      horizontal = (tokenLine === board[index] + board[index + 1] + board[index + 2]);
    } else if ([1, 4, 7].includes(index)) {
      horizontal = (tokenLine === board[index] + board[index - 1] + board[index + 1]);
    } else if ([2, 5, 8].includes(index)) {
      horizontal = (tokenLine === board[index] + board[index - 1] + board[index - 2]);
    }

    return vertical || horizontal;
  }

  return {
    addMark,
    getBoard,
    printBoard,
    checkWin,
  };
}

function GameController(player1 = "P1", player2 = "P2") {
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
  console.log(`It is ${currentPlayer.name}'s turn\n`);
  board.printBoard();

  function getBoard() {
    return board.getBoard();
  }
  
  function switchPlayers() {
    currentPlayer = (currentPlayer === players[0]) ? players[1] : players[0];
  }

  function playRound(index) {
    if (gameStatus === 'running' && board.addMark(index, currentPlayer)) {
      const boardIsFull = !getBoard().includes(null)
      if (board.checkWin(index, currentPlayer)) {
        gameStatus = 'win';
      } else if (boardIsFull) {
        gameStatus = 'tie';
      } else {
        switchPlayers();
        console.log(`It is ${currentPlayer.name}'s turn\n`);
      }
    }
    return {
      gameState: gameStatus,
      currentPlayer: currentPlayer.name,
    }
  }

  return {
    playRound,
    getBoard,
  }
}

