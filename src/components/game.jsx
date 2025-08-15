import React, { useState, useEffect } from "react";
import Board from "./board";

const GAME_MODES = {
  REGULAR_2P: "2P Regular",
  MODIFIED_2P: "2P Disappearing",
  REGULAR_AI: "AI Regular",
  MODIFIED_AI: "AI Disappearing"
};

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [xMoves, setXMoves] = useState([]);
  const [oMoves, setOMoves] = useState([]);
  const [gameMode, setGameMode] = useState(GAME_MODES.REGULAR_AI);
  const winner = calculateWinner(board);

  const vsAI = gameMode === GAME_MODES.REGULAR_AI || gameMode === GAME_MODES.MODIFIED_AI;
  const disappearing = gameMode === GAME_MODES.MODIFIED_2P || gameMode === GAME_MODES.MODIFIED_AI;

  // --- MINIMAX AI WITH ALPHA-BETA PRUNING ---
  function bestMove(board) {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 0; i < 9; i++) {
      if (board[i] == null) {
        board[i] = "O";
        let score = minimax(board, 0, false, -Infinity, Infinity);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    const newBoard = [...board];
    if (move !== null) newBoard[move] = "O";
    return { newBoard, moveIndex: move };
  }

  function minimax(board, depth, isMaximizing, alpha, beta) {
    const scores = { X: -10, O: 10, draw: 0 };
    const winner = calculateWinner(board);
    if (winner) return scores[winner];
    if (board.every((square) => square)) return scores.draw;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] == null) {
          board[i] = "O";
          let score = minimax(board, depth + 1, false, alpha, beta);
          board[i] = null;
          bestScore = Math.max(bestScore, score);
          alpha = Math.max(alpha, bestScore);
          if (beta <= alpha) break;
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] == null) {
          board[i] = "X";
          let score = minimax(board, depth + 1, true, alpha, beta);
          board[i] = null;
          bestScore = Math.min(bestScore, score);
          beta = Math.min(beta, bestScore);
          if (beta <= alpha) break;
        }
      }
      return bestScore;
    }
  }

  // Handle AI turn
  useEffect(() => {
    if (
      vsAI &&
      !isXNext && // O's turn (AI)
      !winner &&
      board.some((v) => v == null)
    ) {
      const timer = setTimeout(() => {
        const { newBoard, moveIndex } = bestMove(board);
        if (moveIndex !== null) {
          handleMove(newBoard, moveIndex, false);
          setIsXNext(true);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [board, isXNext, vsAI, winner]);

  // Move handling for X and O, with optional disappearing logic
  const handleMove = (updatedBoard, moveIndex, isX) => {
    if (disappearing) {
      if (isX) {
        let nextXMoves = [...xMoves, moveIndex];
        if (nextXMoves.length % 4 === 0) {
          const removeIdx = nextXMoves[0];
          updatedBoard = [...updatedBoard];
          updatedBoard[removeIdx] = null;
          nextXMoves = nextXMoves.slice(1);
        }
        setBoard(updatedBoard);
        setXMoves(nextXMoves);
      } else {
        let nextOMoves = [...oMoves, moveIndex];
        if (nextOMoves.length % 4 === 0) {
          const removeIdx = nextOMoves[0];
          updatedBoard = [...updatedBoard];
          updatedBoard[removeIdx] = null;
          nextOMoves = nextOMoves.slice(1);
        }
        setBoard(updatedBoard);
        setOMoves(nextOMoves);
      }
    } else {
      setBoard(updatedBoard);
      if (isX) {
        setXMoves([...xMoves, moveIndex]);
      } else {
        setOMoves([...oMoves, moveIndex]);
      }
    }
  };

  const handleClick = (index) => {
    if (winner || board[index]) return;
    if (vsAI && !isXNext) return; // Ignore if it's AI's turn

    const updatedBoard = [...board];
    updatedBoard[index] = isXNext ? "X" : "O";
    handleMove(updatedBoard, index, isXNext);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setXMoves([]);
    setOMoves([]);
  };

  const status = winner
    ? `Winner: ${winner}`
    : board.every((square) => square)
    ? "Draw!"
    : `Next player: ${
        isXNext ? (vsAI ? "You (X)" : "X") : vsAI ? "AI (O)" : "O"
      }`;

  // Mode Switcher UI
  const modeButtons = [
    { mode: GAME_MODES.REGULAR_2P, label: "2 Player: Regular" },
    { mode: GAME_MODES.MODIFIED_2P, label: "2 Player: Disappearing" },
    { mode: GAME_MODES.REGULAR_AI, label: "Human vs AI: Regular" },
    { mode: GAME_MODES.MODIFIED_AI, label: "Human vs AI: Disappearing" }
  ];

  return (
    <div className="game">
      <div className="status">{status}</div>
      <Board squares={board} onClick={handleClick} />
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
      <div style={{ marginTop: "10px" }}>
        {modeButtons.map(({ mode, label }) => (
          <button
            key={mode}
            className="reset-button"
            style={{
              marginRight: "6px",
              backgroundColor: gameMode === mode ? "#28a745" : undefined
            }}
            onClick={() => {
              setGameMode(mode);
              resetGame();
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {disappearing && (
        <div style={{ marginTop: "16px", fontSize: "12px", color: "#888" }}>
          <b>Special Rule:</b> After every fourth move by a player, their own oldest move disappears!
        </div>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
