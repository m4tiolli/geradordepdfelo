import { promiseConnection } from "@/utils/Connections";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id);

  if (!userId) {
    return NextResponse.json({ error: 'ID do usuário não fornecido.' }, { status: 400 });
  }

  try {
    const resposta = await promiseConnection.query('UPDATE usuario SET ativo = FALSE WHERE id = ?', [userId]);
    return NextResponse.json(resposta)
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const userId = parseInt(params.id)
  const { administrador } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: "ID do usuário não fornecido." }, { status: 400 })
  }

  try {
    const [response] = await promiseConnection.query("UPDATE usuario SET administrador = ? WHERE id = ?", [administrador, userId])
    return NextResponse.json({ resposta: response, administrador, id: userId })
  } catch (error) {
    return NextResponse.json({ error: error, administrador, id: userId }, { status: 500 })
  }
}