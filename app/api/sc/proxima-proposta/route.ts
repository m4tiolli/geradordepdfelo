import { promiseConnection } from "@/utils/Connections";
import { RowDataPacket } from "mysql2/promise";
import { NextResponse } from "next/server";

interface PropostaRow extends RowDataPacket {
  maxId: number | null;
}

export const revalidate = 0;

// Função para executar a consulta SQL
async function buscarMaxId(tabela: string, elo: string, ano: number): Promise<number> {
  const [rows] = await promiseConnection.query<PropostaRow[]>(
    `SELECT MAX(numeroProposta) AS maxId FROM ${tabela} WHERE ano = ? AND elo = ?`,
    [ano, elo]
  );
  return rows[0]?.maxId ?? 0;
}

// Função para gerar a proposta formatada
function gerarProposta(prefixo: string, maxId: number, elo: string, ano: string): string {
  const proximoId = maxId + 1;
  return `${prefixo} ${String(proximoId).padStart(4, '0')}${elo}${ano}`;
}

// Função principal GET
export async function GET() {
  try {
    const anoAtual = new Date().getFullYear();
    const ano = anoAtual.toString().slice(2, 5); // Últimos 2 dígitos do ano

    // Consultas para HH
    const maxIdServicosHH = await buscarMaxId("propostasSCHH", "S", anoAtual);
    const maxIdRecuperadoraHH = await buscarMaxId("propostasSCHH", "R", anoAtual);

    // Consultas para VF
    const maxIdServicosVF = await buscarMaxId("propostasSCVF", "S", anoAtual);
    const maxIdRecuperadoraVF = await buscarMaxId("propostasSCVF", "R", anoAtual);

    // Gerar propostas HH
    const propostaSH = gerarProposta("ELOSCH", maxIdServicosHH, "S", ano);
    const propostaRH = gerarProposta("ELOSCH", maxIdRecuperadoraHH, "R", ano);

    // Gerar propostas VF
    const propostaSF = gerarProposta("ELOSCF", maxIdServicosVF, "S", ano);
    const propostaRF = gerarProposta("ELOSCF", maxIdRecuperadoraVF, "R", ano);

    // Retornar resposta JSON
    return NextResponse.json({
      propostasHH: { propostaSH, propostaRH },
      propostasVF: { propostaSF, propostaRF },
    });

  } catch (error) {
    console.error("Erro ao gerar a proposta:", error);
    return new Response("Erro ao gerar a proposta", { status: 500 });
  }
}
