import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Paiement non encore implémenté.' }, { status: 501 });
}
