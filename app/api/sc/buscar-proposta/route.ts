import { promiseConnection } from "@/utils/Connections";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
    SELECT 
      pSCHH.proposta as codigoProposta,
      pSCHH.cnpjEmpresa,
      pSCHH.razaoEmpresa,
      pSCHH.nomeEmpresa,
      pSCHH.nomeTomador,
      pSCHH.emailTomador,
      pSCHH.telefone1Tomador,
      pSCHH.telefone2Tomador,
      pSCHH.departamentoTomador,
      pSCHH.tipoContato,
      pSCHH.entradaProposta,
      pSCHH.dataProposta,
      pSCHH.dataFullProposta,
      pSCHH.validadeProposta,
      pSCHH.valorTecnico,
      pSCHH.condicaoPagamento,
      pSCHH.escopo,
      pSCHH.revisao,
      pSCHH.dataAtendimento,
      pSCHH.elo,
      pSCHH.link_pdf,
      pSCHH.ano,
      pSCHH.id_vendedor,
      u.nome AS nomeVendedor,
      u.departamento AS departamentoVendedor,
      u.email AS emailVendedor,
      u.telefone1 AS telefone1Vendedor,
      u.telefone2 AS telefone2Vendedor,
      vSC.valorKM,
      vSC.valorDiaria
    FROM propostasSCHH AS pSCHH
    INNER JOIN usuario AS u ON pSCHH.id_vendedor = u.id
    LEFT JOIN valoresSC AS vSC ON pSCHH.elo = 'S' WHERE pSCHH.revisao = (SELECT MAX(sub.revisao) FROM propostasSCHH sub WHERE sub.proposta = pSCHH.proposta)`;

    const [rows] = await promiseConnection.query(query);
    return NextResponse.json(rows);
  } catch (erro) {
    return NextResponse.json({ error: 'Erro ao buscar propostas: ' + erro }, { status: 500 });
  }
}

export const revalidate = 0;
