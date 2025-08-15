import React, { useState, useEffect } from "react";
import Board from "./board";

function Game() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // X = Human, O = AI
  const [vsAI, setVsAI] = useState(true); // Default to Human vs AI
  const [moveHistory, setMoveHistory] = useState([]); // Track order of moves
  const winner = calculateWinner(board);

  // Simple AI: pick a random empty square
  function aiMove(board) {
    const emptyIndices = board
      .map((val, idx) => (val == null ? idx : null))
      .filter((v) => v != null);

    if (emptyIndices.length === 0) return board;
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
        handleMove(newBoard, moveIndex);
        setIsXNext(true);
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [board, isXNext, vsAI, winner]);

  // Centralized move handling with move history and disappearance logic
  const handleMove = (updatedBoard, moveIndex) => {
    let newMoveHistory = [...moveHistory, moveIndex];

    // If it's the 4th, 8th, 12th... move, remove the oldest move
    if (newMoveHistory.length % 4 === 0) {
      const removeIdx = newMoveHistory[0];
      updatedBoard = [...updatedBoard];
      updatedBoard[removeIdx] = null;
      newMoveHistory = newMoveHistory.slice(1);
    }

    setBoard(updatedBoard);
    setMoveHistory(newMoveHistory);
  };

  const handleClick = (index) => {
    if (winner || board[index]) return;
    if (vsAI && !isXNext) return; // Ignore if it's AI's turn

    const updatedBoard = [...board];
    updatedBoard[index] = isXNext ? "X" : "O";
    handleMove(updatedBoard, index);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setMoveHistory([]);
  };

  const status = winner
    ? `Winner: ${winner}`
    : board.every((square) => square)
    ? "Draw!"
    : `Next player: ${
        isXNext ? (vsAI ? "You (X)" : "X") : vsAI ? "AI (O)" : "O"
      }`;

  return (
    <div className="game">
      <div className="status">{status}</div>
      <Board squares={board} onClick={handleClick} />
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
      <button
        className="reset-button"
        style={{ marginLeft: 10 }}
        onClick={() => {
          setVsAI((x) => !x);
          resetGame();
        }}
      >
        {vsAI ? "Switch to 2 Players" : "Play vs AI"}
      </button>
      <div style={{marginTop:"16px", fontSize:"12px", color:"#888"}}>
        <b>Special Rule:</b> Every fourth move, the oldest move will disappear!
      </div>
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
    [2, 4, 6],
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
