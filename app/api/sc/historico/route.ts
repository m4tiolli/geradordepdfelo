import { promiseConnection } from "@/utils/Connections";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const codigo = req.nextUrl.searchParams.get("codigo")

  try {
    if (codigo?.includes("%20")) {
      codigo.replace("%20", " ")
    }
    const [rows] = await promiseConnection.query("SELECT link_pdf, revisao FROM propostasSCHH WHERE proposta = ? ORDER BY revisao DESC", [codigo])
    return NextResponse.json(rows, { status: 200 })
  } catch (error) {
    return NextResponse.json({ erro: error }, { status: 500 })
  }
}