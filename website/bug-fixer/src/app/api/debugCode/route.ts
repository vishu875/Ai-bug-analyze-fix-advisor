import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const GEMINI_API_KEY = 'AIzaSyDF4W-Rw7TFJvrhICX2H3s8vA6JyDMT0lQ';

if (!GEMINI_API_KEY) {
  throw new Error("Missing API Key. Set GEMINI_API_KEY in your environment variables.");
}

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const prompt = `You're a code debugging assistant. Fix any syntax errors, logical bugs, or best practice issues in the following code. Only return the corrected code, nothing else. No explanations, no markdown, just the cleaned-up, corrected version of the code:\n\n${code}`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const contentObj = response.data.candidates?.[0]?.content;
    let correctedCode = contentObj?.parts?.map((p: any) => p.text).join(" ") || null;

    // Clean out Markdown-like stuff if model sneaks it in
    correctedCode = correctedCode
      ?.replace(/^[`]+[a-zA-Z]*|[`]+$/gm, "") // remove ```ts, ```js etc.
      .trim();

    return NextResponse.json({ output: correctedCode });
  } catch (error) {
    console.error("Error debugging code:", (error as any).response?.data || (error as any).message || error);
    return NextResponse.json({ error: "Failed to debug code" }, { status: 500 });
  }
}
