import { useState, useEffect } from "react";

import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import LogComponent from "./components/LogComponent";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";
import geminiAI from "./services/gemini";
import openAIFn from "./services/openai";

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
  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState("Easy");
  const [aiSymbol, setAiSymbol] = useState("X");
  const [aiName, setAiName] = useState("Gemini");

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

  const handlePlayWithAI = () => {
    setIsAiEnabled((prevState) => !prevState);
    handleRestart();
  };

  useEffect(() => {
    handleRestart();
  }, [aiSymbol, aiDifficulty]);

  useEffect(() => {
    if (isAiEnabled && activePlayer === aiSymbol && !winner && !hasDraw) {
      // Here, you would call the AI service to get the next move.
      // For demonstration, we'll just log to the console.
      console.log(
        `AI (${aiName}) is making a move for player '${aiSymbol}' on '${aiDifficulty}' difficulty.`
      );
      async function fetchAIMove() {
        const response = await geminiAI(gameTurns, activePlayer);
        openAIFn();
        const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
        const match = response.match(jsonRegex);

        let jsonString;

        if (match && match[1]) {
          // If markdown wrapper is found, use the content captured by the first group
          jsonString = match[1];
          console.log("Cleaned JSON (extracted from markdown block).");
        } else {
          // If no markdown wrapper is found, assume the entire string is the JSON
          jsonString = rawString;
          console.log("Cleaned JSON (assuming no markdown block).");
        }
        const moveObject = JSON.parse(jsonString);
        setGameTurns((prevGameTurns) => {
          const currentPlayer = derivedActivePlayer(prevGameTurns);
          const newGameTurn = [
            {
              square: {
                row: moveObject.square.row,
                col: moveObject.square.col,
              },
              player: currentPlayer,
            },
            ...prevGameTurns,
          ];
          return newGameTurn;
        });
      }
      fetchAIMove();
    }
  }, [
    isAiEnabled,
    activePlayer,
    aiSymbol,
    aiName,
    aiDifficulty,
    gameTurns,
    winner,
    hasDraw,
  ]);
  return (
    <main>
      <div id="game-container">
        <div className="ai-selection-container">
          <button className="ai-button" onClick={handlePlayWithAI}>
            Play With AI
          </button>
          <select
            className="ai-dropdown"
            disabled={!isAiEnabled}
            value={aiDifficulty}
            onChange={(e) => setAiDifficulty(e.target.value)}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select
            className="ai-dropdown"
            disabled={!isAiEnabled}
            value={aiSymbol}
            onChange={(e) => setAiSymbol(e.target.value)}
          >
            <option>Select AI Symbol</option>
            <option>X</option>
            <option>O</option>
          </select>
          <select
            className="ai-dropdown"
            disabled={!isAiEnabled}
            value={aiName}
            onChange={(e) => setAiName(e.target.value)}
          >
            <option>Select AI</option>
            <option>Gemini</option>
            <option>Chat GPT</option>
          </select>
        </div>

        <ol id="players" className="highlight-player">
          <Player
            name="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
            isAi={isAiEnabled && aiSymbol === "X"}
            aiName={aiName}
            changeName={handlePlayerChangeName}
          />
          <Player
            name="Player 2"
            symbol="O"
            isActive={activePlayer === "O"}
            isAi={isAiEnabled && aiSymbol === "O"}
            aiName={aiName}
            changeName={handlePlayerChangeName}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} restart={handleRestart} />
        )}
        <GameBoard
          board={gameBoard}
          // Disable the board when it's AI's turn (either currently performing a move
          // `aiTurn` OR when AI is enabled and the active player is the AI's symbol).
          disabledCell={isAiEnabled && activePlayer === aiSymbol}
          onSelectSquare={handleSelectSquare}
        />
      </div>
      <LogComponent gameTurns={gameTurns} />
    </main>
  );
}

export default App;
