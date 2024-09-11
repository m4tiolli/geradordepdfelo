import { promiseConnection } from "@/utils/Connections";
import { RowDataPacket } from "mysql2/promise";
import { NextRequest, NextResponse } from "next/server";

interface PropostaRow extends RowDataPacket {
  maxId: number | null;
}

export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const anoAtual = new Date().getFullYear();

    const [rowsServicos] = await promiseConnection.query<PropostaRow[]>(
      'SELECT MAX(id) AS maxIdServicos FROM propostas WHERE ano = ? AND elo = \'S\'',
      [anoAtual]
    );

    const [rowsRecuperadora] = await promiseConnection.query<PropostaRow[]>(
      'SELECT MAX(id) AS maxIdRecuperadora FROM propostas WHERE ano = ? AND elo = \'R\'',
      [anoAtual]
    );

    const maxIdServicos = rowsServicos[0]?.maxIdServicos ?? 0;
    const maxIdRecuperadora = rowsRecuperadora[0]?.maxIdRecuperadora ?? 0;

    const proximoIdServicos = maxIdServicos + 1;
    const proximoIdRecuperadora = maxIdRecuperadora + 1;

    const propostaServicos = `ELOEF ${anoAtual}S${String(proximoIdServicos).padStart(5, '0')}`;
    const propostaRecuperadora = `ELOEF ${anoAtual}R${String(proximoIdRecuperadora).padStart(5, '0')}`;

    const proposta = { propostaRecuperadora, propostaServicos };

    return NextResponse.json({ proposta });
  } catch (error) {
    console.error("Erro ao gerar a proposta:", error);
    return new Response("Erro ao gerar a proposta", { status: 500 });
  }
}

