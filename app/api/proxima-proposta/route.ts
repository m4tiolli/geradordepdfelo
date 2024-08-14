import { promiseConnection } from "@/utils/Connections";
import { RowDataPacket } from "mysql2/promise";

interface PropostaRow extends RowDataPacket {
  maxId: number | null;
}

export async function GET(request: Request) {
  try {
    const anoAtual = new Date().getFullYear();
    const [rows] = await promiseConnection.query<PropostaRow[]>(
      'SELECT MAX(id) as maxId FROM propostas WHERE ano = ?',
      [anoAtual]
    );

    const maxId = rows[0]?.maxId || 0;
    const proximoId = maxId + 1;
    const proposta = `ELOEF ${anoAtual}${String(proximoId).padStart(5, '0')}`;

    return new Response(JSON.stringify({ proposta }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Erro ao gerar a proposta:", error);
    return new Response("Erro ao gerar a proposta", { status: 500 });
  }
}
