import { NextResponse } from 'next/server';

const DEFILLAMA_API = 'https://api.llama.fi';

export async function GET() {
  try {
    const response = await fetch(`${DEFILLAMA_API}/protocols`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching protocols from DeFi Llama:', error);
    return NextResponse.json({ error: 'Failed to fetch protocols' }, { status: 500 });
  }
}
