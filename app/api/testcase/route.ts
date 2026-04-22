import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "ollama",
  baseURL: "http://localhost:11434/v1",
});

export async function POST(req: NextRequest) {
  try {
    const { problemDescription } = await req.json();

    if (!problemDescription) {
      return NextResponse.json(
        { message: "Problem description is required" },
        { status: 400 },
      );
    }

    const prompt = `
Generate only JSON and nothing else.

Generate at least 3 diverse and valid test cases for the following coding problem.

Each test case must contain:
- input
- expectedOutput

Rules:
- input should be structured properly
- include at least one edge case
- do not include markdown
- do not include explanations
- return only a JSON array

Problem description:
${problemDescription}
`;

    const completion = await client.chat.completions.create({
      model: "qwen2.5-coder:1.5b",
      temperature: 0.4,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "You generate JSON test cases for coding problems. Only return valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = completion.choices[0]?.message?.content || "";

    const cleanedText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let testCases;

    try {
      testCases = JSON.parse(cleanedText);
    } catch {
      testCases = { error: "Failed to parse generated test cases" };
    }

    return NextResponse.json({
      testCases,
    });
  } catch (error) {
    console.error("Error generating test cases:", error);

    return NextResponse.json(
      { message: "Error generating test cases" },
      { status: 500 },
    );
  }
}
