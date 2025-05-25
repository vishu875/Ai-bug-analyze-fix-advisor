import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = 'AIzaSyBVAgjzKkT2y33pklu39L9MIvL3MmhhmYA';

if (!GEMINI_API_KEY) {
  throw new Error("Missing API Key. Set GEMINI_API_KEY in your environment variables.");
}

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const prompt = `Analyze the following code line by line. Check each line for syntax errors, logical issues, performance problems, and violations of coding best practices related to readability, efficiency, and maintainability. Only include lines that have errors or could be improved, along with a clear explanation for each issue. If the entire code is correct and follows best practices, provide a simple and clear explanation of what the complete code is doing. Use plain English with no Markdown symbols, no code blocks, and no unnecessary formatting. Keep the explanation concise and beginner-friendly.\n\n${code}`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const contentObj = response.data.candidates?.[0]?.content;
    let extractedText = contentObj?.parts?.map((p: any) => p.text).join(" ") || null;

    // **Cleaning up Markdown Symbols (if present)**
    extractedText = extractedText
      ?.replace(/[*#`]/g, "") // Remove *, #, and ` symbols
      .replace(/\n\s*\n/g, "\n") // Remove excessive new lines
      .trim();

    return NextResponse.json({ analysis: extractedText });
  } catch (error) {
    console.error("Error analyzing code:", error);
    return NextResponse.json({ error: "Failed to analyze code" }, { status: 500 });
  }
}