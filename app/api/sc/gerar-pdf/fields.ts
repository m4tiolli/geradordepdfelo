import { ValuesSC } from "@/interfaces/SC";
import { formatarData } from "@/utils/Handles";
import extenso from "extenso";
import { PDFFont } from "pdf-lib";

interface IFields {
  body: ValuesSC
  fontBold: PDFFont;
  fontLight: PDFFont;
  fontArial: PDFFont;
  formatDate: (e: string) => string;
  formatCNPJ: (e: string) => void;
  formatValor: (e: number) => string
}

export const fields = ({
  body,
  fontBold,
  fontLight,
  fontArial,
  formatDate,
  formatCNPJ,
  formatValor,
}: IFields) => [
    { name: "CNPJEmpresa", value: formatCNPJ(body.cnpjEmpresa), font: fontLight, size: 12 },
    { name: "NomeEmpresa", value: body.nomeEmpresa, font: fontBold, size: 15 },
    { name: "RazaoEmpresa", value: body.razaoEmpresa, font: fontLight, size: 12 },
    { name: "Tomador", value: body.nomeTomador, font: fontLight, size: 10 },
    { name: "Email", value: body.emailTomador, font: fontLight, size: 10 },
    { name: "Telefone1Tomador", value: body.telefone1Tomador, font: fontLight, size: 10 },
    { name: "Telefone2Tomador", value: body.telefone2Tomador, font: fontLight, size: 10 },
    { name: "Departamento", value: body.departamentoTomador, font: fontLight, size: 10 },
    { name: "Vendedor", value: body.nomeVendedor, font: fontLight, size: 10 },
    { name: "EmailVendedor", value: body.emailVendedor, font: fontLight, size: 10 },
    { name: "Telefone1Vendedor", value: body.telefone1Vendedor, font: fontLight, size: 10 },
    { name: "Telefone2Vendedor", value: body.telefone2Vendedor, font: fontLight, size: 10 },
    { name: "DepartamentoVendedor", value: body.departamentoVendedor, font: fontLight, size: 10 },
    { name: "Contato", value: body.tipoContato, font: fontBold, size: 11 },
    { name: "Entrada", value: formatDate(body.entradaProposta as string), font: fontBold, size: 11 },
    { name: "Data", value: formatDate(body.dataProposta as string), font: fontBold, size: 11 },
    { name: "DataFull", value: formatarData(body.dataProposta as string), font: fontLight, size: 11 },
    { name: "Proposta", value: body.codigoProposta, font: fontBold, size: 11 },
    { name: "ValidadeProposta", value: body.validadeProposta, font: fontArial, size: 10 },
    { name: "ValorDiaria", value: "R$ " + formatValor(parseFloat(body.valorDiaria)), font: fontArial, size: 10 },
    { name: "ValorKM", value: formatValor(parseFloat(body.valorKM)) + " (" + extenso(withDots(body.valorKM), { mode: 'currency' }) + ")", font: fontArial, size: 10 },
    { name: "TecnicoEspecialista", value: "R$ " + formatValor(parseFloat(body.valorTecnico)) + " (" + extenso(withDots(body.valorTecnico), { mode: 'currency' }) + ")", font: fontArial, size: 10 },
    { name: "CondicaoPagamento", value: body.condicaoPagamento, font: fontArial, size: 10 },
    { name: "Escopo", value: body.escopo, font: fontArial, size: 10 },
    { name: "DataAtendimento", value: body.dataAtendimento, font: fontArial, size: 10 },
  ];

  const withDots = (value: string | number) => {
    const strValue = typeof value === 'number' ? value.toString() : value;
    const yes = strValue.includes(".") ? strValue.replace(".", ",") : strValue;
    return yes;
  };
  