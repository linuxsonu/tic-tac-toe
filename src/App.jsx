import { useState } from "react";

import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import LogComponent from "./components/LogComponent";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function derivedActivePlayer(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

function deriveWinner(gameBoard, playerName) {
  let winner;

  WINNING_COMBINATIONS.forEach((combination) => {
    const firstCell = gameBoard[combination[0].row][combination[0].column];
    const secondCell = gameBoard[combination[1].row][combination[1].column];
    const thirdCell = gameBoard[combination[2].row][combination[2].column];
    if (firstCell && firstCell === secondCell && firstCell === thirdCell) {
      winner = playerName[firstCell];
    }
  });
  return winner;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = initialGameBoard.map((row) => [...row]);
  gameTurns.forEach((turn) => {
    const { row, col } = turn.square;
    gameBoard[row][col] = turn.player;
  });
  return gameBoard;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = derivedActivePlayer(gameTurns);
  const [playerName, setPlayerName] = useState({
    X: "Player 1",
    O: "Player 2",
  });

  let gameBoard = deriveGameBoard(gameTurns);

  const winner = deriveWinner(gameBoard, playerName);

  const hasDraw = !winner && gameTurns.length === 9;
  const handleSelectSquare = (rowIndex, colIndex) => {
    setGameTurns((prevGameTurns) => {
      const currentPlayer = derivedActivePlayer(prevGameTurns);
      const newGameTurn = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevGameTurns,
      ];
      return newGameTurn;
    });
  };

  const handleRestart = () => {
    setGameTurns([]);
  };

  const handlePlayerChangeName = (symbol, newName) => {
    setPlayerName((prevNames) => ({
      ...prevNames,
      [symbol]: newName,
    }));
  };

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            name="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
            changeName={handlePlayerChangeName}
          />
          <Player
            name="Player 2"
            symbol="O"
            isActive={activePlayer === "O"}
            changeName={handlePlayerChangeName}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} restart={handleRestart} />
        )}
        <GameBoard board={gameBoard} onSelectSquare={handleSelectSquare} />
      </div>
      <LogComponent gameTurns={gameTurns} />
    </main>
  );
}

export default App;
