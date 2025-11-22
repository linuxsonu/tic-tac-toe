export default function GameBoard({ board, onSelectSquare }) {
  const handleSelectedCell = (rowIndex, cellIndex) => {
    onSelectSquare(rowIndex, cellIndex);
  };

  return (
    <ol id="game-board">
      {board.map((row, rowIndex) => (
        <li key={rowIndex} className="board-row">
          <ol>
            {row.map((cell, cellIndex) => (
              <li key={cellIndex}>
                <button
                  onClick={() => handleSelectedCell(rowIndex, cellIndex)}
                  disabled={cell !== null}
                >
                  {cell}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
