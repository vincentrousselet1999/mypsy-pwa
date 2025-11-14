import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const headerSecret = request.headers.get('x-admin-secret');
  if (!process.env.JWT_SECRET || headerSecret !== process.env.JWT_SECRET) {
    return NextResponse.json({ message: 'Non autorisé.' }, { status: 401 });
  }
  return NextResponse.json({ message: 'Non implémenté.' }, { status: 501 });
}
