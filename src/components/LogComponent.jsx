export default function LogComponent({ gameTurns }) {
  return (
    <ol id="log">
      {gameTurns.map((turn, index) => {
        return (
          <li key={index}>
            Player {turn.player} selected row {turn.square.row + 1}, column{" "}
            {turn.square.col + 1}
          </li>
        );
      })}
    </ol>
  );
}
