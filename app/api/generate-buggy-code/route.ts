import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "ollama",
  baseURL: "http://localhost:11434/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { level, language } = await req.json();

    if (!level || !language) {
      return NextResponse.json(
        { message: "Level and language are required" },
        { status: 400 },
      );
    }

    const codePrompt = `Generate a buggy code which isn't easy to fix for a ${level} level problem in ${language}. Only provide the code, no markdown, no comments, and no extra text.`;

    const codeCompletion = await client.chat.completions.create({
      model: "qwen2.5-coder:1.5b",
      temperature: 0.9,
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content:
            "You generate buggy programming questions for students. Only return raw code.",
        },
        {
          role: "user",
          content: codePrompt,
        },
      ],
    });

    const responseText = codeCompletion.choices[0]?.message?.content || "";

    const codeMatch = responseText.match(/(?:```[\w+]*\n)?([\s\S]*?)(?:```|$)/);

    const buggyCode = codeMatch ? codeMatch[1] : "No code generated";

    const hintPrompt = `Provide a clear and concise explanation of the following code. The explanation should include:
- Brief overview of the program
- Main components and purpose
- Expected input/output behavior

Keep it under 500 characters.

Code:
${buggyCode}`;

    const problemTitlePrompt = `Generate a short problem title for this code. Only return the title with no quotes or special formatting.

Code:
${buggyCode}`;

    const resolveHintsPrompt = `Analyze the following buggy code and generate a concise list of hints to help fix it.

Do not fix the code.
Do not rewrite the code.
Only give hints about:
- Missing or incorrect lines
- Logic mistakes
- Syntax issues

Code:
${buggyCode}`;

    const [hintResult, titleResult, resolveHintsResult] = await Promise.all([
      client.chat.completions.create({
        model: "qwen2.5-coder:1.5b",
        temperature: 0.5,
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content: "You explain code clearly and briefly.",
          },
          {
            role: "user",
            content: hintPrompt,
          },
        ],
      }),

      client.chat.completions.create({
        model: "qwen2.5-coder:1.5b",
        temperature: 0.4,
        max_tokens: 30,
        messages: [
          {
            role: "system",
            content: "You generate short coding problem titles.",
          },
          {
            role: "user",
            content: problemTitlePrompt,
          },
        ],
      }),

      client.chat.completions.create({
        model: "qwen2.5-coder:1.5b",
        temperature: 0.6,
        max_tokens: 200,
        messages: [
          {
            role: "system",
            content:
              "You give concise debugging hints without fixing the code.",
          },
          {
            role: "user",
            content: resolveHintsPrompt,
          },
        ],
      }),
    ]);

    const hint = hintResult.choices[0]?.message?.content || "No hint generated";

    const problemTitleText =
      titleResult.choices[0]?.message?.content || "Untitled Problem";

    const resolveHints =
      resolveHintsResult.choices[0]?.message?.content ||
      "No debugging hints generated";

    return NextResponse.json({
      code: buggyCode,
      hint,
      problemTitleText,
      resolveHints,
    });
  } catch (error) {
    console.error("Error fetching buggy code:", error);

    return NextResponse.json(
      { message: "Error generating buggy code" },
      { status: 500 },
    );
  }
}
