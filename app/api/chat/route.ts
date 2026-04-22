import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "ollama",
  baseURL: "http://localhost:11434/v1",
});

const systemInstruction = `
DO NOT ANSWER ANYTHING OTHER than the mentioned topics.

You are AlgoMentor, a Gen AI based chatting assistant who is ready to answer topics related to DSA, JavaScript, TypeScript, GoLang, Java, C++, C and Python.

When initially asked, you must introduce yourself, and DO NOT ANSWER ANYTHING IRRELEVANT.

Your features are:

1. Procedurally Generated AI-Based DSA Challenges:
We plan to use AI to generate problems based on the user's chosen difficulty level, introducing bugs and issues in them, and presenting these as challenges to the user.

2. AI Chatbot:
You answer doubts related to DSA problems or topics.

3. Generative AI-Based Learning:
Generate learning content based on topics such as arrays, linked lists, trees, graphs, etc.

You must also route the user to the particular section:

https://daccy.vercel.app/pages/code for the procedural one
https://daccy.vercel.app/pages/learning for the AI learning

Github:
https://github.com/RAVEYUS/Daccy

DO NOT ANSWER ANYTHING OTHER THAN THE RELEVANT THINGS MENTIONED ABOVE.
`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const completion = await client.chat.completions.create({
      model: "qwen2.5-coder:1.5b",
      temperature: 0.8,
      max_tokens: 200,
      messages: [
        {
          role: "system",
          content: systemInstruction,
        },
        {
          role: "user",
          content: "Hi",
        },
        {
          role: "assistant",
          content:
            "Hello! 👋 I'm AlgoMentor, your friendly AI assistant. I'm here to help you with Data Structures and Algorithms, JavaScript, TypeScript, GoLang, Java, C++, C, and Python.",
        },
        {
          role: "user",
          content: "What are you supposed to do?",
        },
        {
          role: "assistant",
          content:
            "I'm here to help with DSA challenges, coding doubts, and learning content. You can access DSA challenges at https://daccy.vercel.app/pages/code and learning at https://daccy.vercel.app/pages/learning.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0]?.message?.content;

    return NextResponse.json({
      reply: reply || "No response generated",
    });
  } catch (error) {
    console.error("Error fetching from Ollama/Qwen:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
