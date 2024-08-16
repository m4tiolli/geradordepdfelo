import { promiseConnection } from "@/utils/Connections";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const [rows] = await promiseConnection.query("SELECT * FROM departamentos ORDER BY id");

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);

    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
}
