import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "ollama",
  baseURL: "http://localhost:11434/v1",
});

export async function POST(req: Request) {
  try {
    const { message, selectedTopic, language, understandingLevel } =
      await req.json();

    if (!message || !selectedTopic) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    let prompt: string;

    if (language) {
      prompt = `
You are an AI tutor specializing in ${selectedTopic} using ${language}.

The user's prompt is: "${message}"

Do not quote the user's prompt.

Provide a helpful and concise response tailored to their understanding level: ${understandingLevel}.

If code examples are appropriate, include them.
`;
    } else {
      prompt = `
You are an AI tutor specializing in ${selectedTopic}.

The user's prompt is: "${message}"

Do not quote the user's prompt.

Provide a helpful and concise response tailored to their understanding level: ${understandingLevel}.

If relevant examples are appropriate, include them.
`;
    }

    const completion = await client.chat.completions.create({
      model: "qwen2.5-coder:1.5b",
      temperature: 0.7,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI tutor for programming, DSA, and coding topics.",
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
