import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data', 'chat-settings.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading chat-settings.json:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(payload, null, 2), 'utf8');
    return NextResponse.json({ message: 'Settings updated successfully', data: payload });
  } catch (error) {
    console.error('Error writing chat-settings.json:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
