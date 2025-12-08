import { useState, useEffect } from "react";
export default function Player({
  name,
  symbol,
  isActive,
  isAi,
  aiName,
  changeName,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(name);
  const toggleEditing = () => {
    setIsEditing((editing) => !editing);
    if (isEditing) {
      changeName(symbol, inputValue);
    }
  };
  useEffect(() => {
    if (isAi) {
      setInputValue(aiName);
    } else {
      setInputValue(name);
    }
  }, [aiName, isAi, name]);
  return (
    <li className={isActive ? "active" : ""}>
      <span className="player">
        {!isEditing ? (
          <span className="player-name">{inputValue}</span>
        ) : (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
        <span className="player-symbol">{symbol}</span>
      </span>
      {!isAi && (
        <button onClick={() => toggleEditing()}>
          {isEditing ? "Save" : "Edit"}
        </button>
      )}
    </li>
  );
}
