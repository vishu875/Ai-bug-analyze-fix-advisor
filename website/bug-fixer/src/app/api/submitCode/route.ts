import { NextResponse } from 'next/server';

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com/submissions/';

const JUDGE0_API_KEY = "3bf5d4fac8msh701fa5678e01639p1b8657jsn7d5bb94d9a95";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received request:', body); // Debugging log

    const response = await fetch(`${JUDGE0_API_URL}?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY, // Required only if using RapidAPI
      },
      body: JSON.stringify({
        source_code: body.code,
        language_id: body.language_id,
        stdin: body.stdin || '',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Judge0 API Error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch from Judge0' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
