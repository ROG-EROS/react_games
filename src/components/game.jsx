import React, { useState } from "react";  
import Board from "./board";
function Game() {  
  const [board, setBoard] = useState(Array(9).fill(null));  
  const [isXNext, setIsXNext] = useState(true);  

  const winner = calculateWinner(board);  

  const resetGame = () => {  
    setBoard(Array(9).fill(null)); // Reset the board  
    setIsXNext(true); // Reset the player turn to "X"  
  }; 

  const handleClick = (index) => {  
    if (winner || board[index]) return; // Prevent overwriting or clicking after a win  
    const newBoard = [...board];  
    newBoard[index] = isXNext ? "X" : "O";  
    setBoard(newBoard);  
    setIsXNext(!isXNext);  
  };  

  const status = winner  
    ? `Winner: ${winner}`  
    : board.every((square) => square)  
    ? "Draw!"  
    : `Next player: ${isXNext ? "X" : "O"}`;  

  return (  
    <div className="game">  
      <div className="status">{status}</div>  
      <Board squares={board} onClick={handleClick} />  
      <button className="reset-button" onClick={resetGame}>  
        Reset Game  
      </button>  
    </div>  
  );  
}  

function calculateWinner(squares) {  
  const lines = [  
    [0, 1, 2], // Rows  
    [3, 4, 5],  
    [6, 7, 8],  
    [0, 3, 6], // Columns  
    [1, 4, 7],  
    [2, 5, 8],  
    [0, 4, 8], // Diagonals  
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