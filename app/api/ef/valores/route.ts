import { promiseConnection } from "@/utils/Connections";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const query = "SELECT * FROM fatorFinanceiro ORDER BY meses";
    const [rows] = await promiseConnection.query(query)
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ erro: error })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { meses, valor, porcentagem, implementacao, id } = await req.json()
    const [result] = await promiseConnection.query(`UPDATE fatorFinanceiro SET meses = ?, valor = ?, porcentagem = ?, implementacao = ? WHERE id = ?`, [meses, valor, porcentagem, implementacao, id])
    if (result) {
      return new Response("Dados Atualizados!", { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ erro: error })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { meses, valor, porcentagem, implementacao } = await req.json()
    const [result] = await promiseConnection.query("INSERT INTO fatorFinanceiro (meses, valor, porcentagem, implementacao) VALUES (?, ?, ?, ?)", [meses, valor, porcentagem, implementacao])
    if (result) {
      return new Response("Fator criado!", { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ erro: error })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.headers.get("id")
    const [result] = await promiseConnection.query("DELETE FROM fatorFinanceiro WHERE id = ?", [id])
    if (result) {
      return new Response("Fator deletado!", { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ erro: error })
  }
}