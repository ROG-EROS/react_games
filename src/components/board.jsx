import Square from './square';
function Board({ squares, onClick }) {  
    return (  
      <div className="board">  
        {squares.map((value, index) => (  
          <Square key={index} value={value} onClick={() => onClick(index)} />  
        ))}  
      </div>  
    );  
  }
  export default Board;