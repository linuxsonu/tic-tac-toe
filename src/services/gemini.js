import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

async function geminiAI(arrayOfTurn, lastPlayer) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `The current Tic-Tac-Toe game moves array is: ${JSON.stringify(
              arrayOfTurn
            )}. It is Player '${
              lastPlayer === "X" ? "O" : "X"
            }'s turn to make the next move. Suggest only the single, next optimal move for '${
              lastPlayer === "X" ? "O" : "X"
            }'. Return the move as a single JSON object like this 
            {
                "square": {
                  "row": 1,
                  "col": 1
                },
                "player": "X"
              }. Do not include any explanations or surrounding text.`,
          },
        ],
      },
    ],
  });
  return response.text;
}

export default geminiAI;
