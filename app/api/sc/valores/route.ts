/* eslint-disable @typescript-eslint/no-explicit-any */
import { promiseConnection } from "@/utils/Connections";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const query = "SELECT * FROM valoresSC";
    const [rows] = await promiseConnection.query(query)
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ erro: error })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { campo, valor } = await req.json()
    const [result]: any = await promiseConnection.query(`UPDATE valoresSC SET ${campo} = ? WHERE id = 1`, [valor])
    if (result.affectedRows) {
      return new Response("Dados Atualizados!", { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ erro: error })
  }
}