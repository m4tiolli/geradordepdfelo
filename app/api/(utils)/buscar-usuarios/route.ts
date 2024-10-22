import { promiseConnection } from "@/utils/Connections";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const query = `SELECT id, nome, departamento, telefone1, telefone2, email, administrador FROM usuario WHERE ativo = FALSE`
    const [rows] = await promiseConnection.query(query)
    return NextResponse.json(rows)
  } catch (erro) {
    return NextResponse.json({ error: 'Erro ao buscar usuarios' }, { status: 500 });
  }
}

export const revalidate = 0