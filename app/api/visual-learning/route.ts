import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "ollama",
  baseURL: "http://localhost:11434/v1",
});

export async function POST(req: Request) {
  try {
    const { selectedTopic, language } = await req.json();

    if (!selectedTopic) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const prompt = createPrompt(selectedTopic, language);

    const completion = await client.chat.completions.create({
      model: "qwen2.5-coder:1.5b",
      temperature: 0.7,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI tutor for coding, DSA, and programming concepts.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiResponse = completion.choices[0]?.message?.content;

    return NextResponse.json({
      reply: aiResponse || "No response generated",
    });
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 },
    );
  }
}

function createPrompt(selectedTopic: string, language?: string): string {
  let basePrompt = `You are an AI tutor specializing in ${selectedTopic}.`;

  if (language) {
    basePrompt = `You are an AI tutor specializing in ${selectedTopic} using ${language}. ${basePrompt}`;
  }

  basePrompt += ` Explain the topic clearly and simply.`;

  basePrompt += ` If code examples are appropriate, include them.`;

  return basePrompt;
}
