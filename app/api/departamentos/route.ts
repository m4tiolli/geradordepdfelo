import { promiseConnection } from "@/utils/Connections";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const query = "SELECT * FROM departamentos ORDER BY nome";
    const [rows] = await promiseConnection.query(query)
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ erro: error })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { nome, id } = await req.json()
    const [result] = await promiseConnection.query(`UPDATE departamentos SET nome = ? WHERE id = ?`, [nome, id])
    if (result) {
      return new Response("Dados Atualizados!", { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ erro: error })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nome } = await req.json()
    const [result] = await promiseConnection.query("INSERT INTO departamentos (nome) VALUES (?)", [nome])
    if (result) {
      return new Response("Departamento criado!", { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ erro: error })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.headers.get("id")
    const [result] = await promiseConnection.query("DELETE FROM departamentos WHERE id = ?", [id])
    if (result) {
      return new Response("Departamento deletado!", { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ erro: error })
  }
}