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

  // Simple AI: pick a random empty square
  function aiMove(board) {
    const emptyIndices = board
      .map((val, idx) => (val == null ? idx : null))
      .filter((v) => v != null);

    if (emptyIndices.length === 0) return { newBoard: board, moveIndex: null };
    const move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const newBoard = [...board];
    newBoard[move] = "O";
    return { newBoard, moveIndex: move };
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
        const { newBoard, moveIndex } = aiMove(board);
        if (moveIndex !== null) {
          handleMove(newBoard, moveIndex, false);
          setIsXNext(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [board, isXNext, vsAI, winner]);

  // Move handling for X and O, with optional disappearing logic
  const handleMove = (updatedBoard, moveIndex, isX) => {
    if (disappearing) {
      if (isX) {
        let nextXMoves = [...xMoves, moveIndex];
        // After 4th, 8th, ... move, remove X's oldest move
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
        // After 4th, 8th, ... move, remove O's oldest move
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
