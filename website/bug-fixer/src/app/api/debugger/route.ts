import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const { code, language } = await req.json();

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        // Replace <port> with the actual port your Python backend is running on
        const linuxServerUrl = 'http://10.23.20.36:8000/api/debugCode'; // Adjust the URL as needed

        const response = await fetch(linuxServerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language }),  // Language optional depending on your backend
        });

        if (!response.ok) {
            const text = await response.text(); // For better debugging
            return NextResponse.json({ error: 'Linux server error', detail: text }, { status: response.status });
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal server error', detail: error.message }, { status: 500 });
    }
}
