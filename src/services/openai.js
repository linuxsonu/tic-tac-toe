import OpenAI from "openai";
const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function openAIFn() {
  const response = await client.responses.create({
    model: "gpt-5-nano",
    input: "Write a one-sentence bedtime story about a unicorn.",
  });
  console.log(response.output_text);
  return response;
}

export default openAIFn;
