import { promiseConnection } from "@/utils/Connections";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const query = `SELECT p.ano,
 p.proposta,
 p.nomeEmpresa,
 p.razaoEmpresa,
 p.cnpjEmpresa,
 p.tomador,
 p.departamento as departamentoTomador,
 p.email AS emailTomador,
 p.telefone AS telefoneTomador,
 p.potencia,
 p.valor,
 p.meses,
 p.link_pdf,
 p.data,
 p.contaEnergia,
 u.nome AS nomeVendedor,
 u.departamento AS departamentoVendedor,
 u.email AS emailVendedor,
 u.telefone1 AS telefone1Vendedor,
 u.telefone2 AS telefone2Vendedor
 FROM propostas AS p INNER JOIN usuario AS u WHERE p.id_usuario = u.id`
    const [rows] = await promiseConnection.query(query)
    return NextResponse.json(rows)
  } catch (erro) {
    return NextResponse.json({ error: 'Erro ao buscar propostas' }, { status: 500 });
  }
}

export const revalidate = 0