// Initial game state
let board = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;
let currentPlayer = "X";

// Difficulty level (default to easy)
let difficulty = "easy";

// Score tracking
let scoreXWins = 0;
let scoreOWins = 0;
let scoreTie = 0;

// DOM Elements
const scoreXWinsDisplay = document.getElementById("score-x");
const scoreOWinsDisplay = document.getElementById("score-o");
const scoreTieDisplay = document.getElementById("score-tie");
const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset-button");
const resetScoreboardButton = document.getElementById("reset-scoreboard");
const difficultySelect = document.getElementById("difficulty");

// Update the scoreboard
const updateScoreboard = (winner) => {
  if (winner === "X") {
    scoreXWins++;
    scoreXWinsDisplay.textContent = scoreXWins;
  } else if (winner === "O") {
    scoreOWins++;
    scoreOWinsDisplay.textContent = scoreOWins;
  } else if (winner === "Tie") {
    scoreTie++;
    scoreTieDisplay.textContent = scoreTie;
  }
};

// Check for winner
const checkWinner = () => {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  if (!board.includes("")) return "Tie";
  return null;
};

// AI Easy: Random move
const aiRandomMove = () => {
  const emptyCells = board.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomIndex] = "O";
  cells[randomIndex].textContent = "O";
  cells[randomIndex].classList.add("taken");
};

// AI Medium: Block winning move or random move
const aiMediumMove = () => {
  // Check if the opponent is about to win and block it
  const blockMove = findBlockingMove("X");
  if (blockMove !== null) {
    board[blockMove] = "O";
    cells[blockMove].textContent = "O";
    cells[blockMove].classList.add("taken");
  } else {
    aiRandomMove(); // If no blocking needed, make a random move
  }
};

// AI Hard: Minimax algorithm for optimal move
const aiHardMove = () => {
  const bestMove = minimax(board, "O").index;
  board[bestMove] = "O";
  cells[bestMove].textContent = "O";
  cells[bestMove].classList.add("taken");
};

// Find a blocking move
const findBlockingMove = (player) => {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    const values = [board[a], board[b], board[c]];
    if (values.filter(v => v === player).length === 2 && values.includes("")) {
      return [a, b, c].find(index => board[index] === "");
    }
  }
  return null;
};

// Minimax Algorithm
const minimax = (newBoard, player) => {
  const emptyCells = newBoard.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
  const winner = checkWinner();

  if (winner === "X") return { score: -10 };
  if (winner === "O") return { score: 10 };
  if (emptyCells.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < emptyCells.length; i++) {
    const move = {};
    move.index = emptyCells[i];
    newBoard[emptyCells[i]] = player;

    if (player === "O") {
      move.score = minimax(newBoard, "X").score;
    } else {
      move.score = minimax(newBoard, "O").score;
    }

    newBoard[emptyCells[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
};

// Handle Cell Click
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (board[index] || !isGameActive || currentPlayer !== "X") return;

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add("taken");

    const winner = checkWinner();
    if (winner) {
      isGameActive = false;
      updateScoreboard(winner);
      alert(winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`);
    } else {
      currentPlayer = "O";
      if (difficulty === "easy") aiRandomMove();
      else if (difficulty === "medium") aiMediumMove();
      else aiHardMove();
      const winnerAfterAi = checkWinner();
      if (winnerAfterAi) {
        isGameActive = false;
        updateScoreboard(winnerAfterAi);
        alert(winnerAfterAi === "Tie" ? "It's a Tie!" : `${winnerAfterAi} Wins!`);
      } else {
        currentPlayer = "X";
      }
    }
  });
});

// Restart the Game
resetButton.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  currentPlayer = "X";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("taken");
  });
});

// Reset Scoreboard
resetScoreboardButton.addEventListener("click", () => {
  scoreXWins = 0;
  scoreOWins = 0;
  scoreTie = 0;
  scoreXWinsDisplay.textContent = scoreXWins;
  scoreOWinsDisplay.textContent = scoreOWins;
  scoreTieDisplay.textContent = scoreTie;
});

// Set Difficulty
difficultySelect.addEventListener("change", (e) => {
  difficulty = e.target.value;
});
