import { ValuesSC } from "@/interfaces/SC";
import { ChangeEvent } from "react";

interface Inputs {
  name: string;
  value: string | number | Date;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  dica: string;
  type?: string
}

interface IDados {
  values: ValuesSC;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// 1. Dados da Empresa
export const inputsDadosEmpresa = ({ values, onChange }: IDados): Inputs[] => [
  {
    name: "razaoEmpresa",
    value: values.razaoEmpresa,
    onChange: onChange,
    placeholder: "Razão da Empresa",
    dica: "Razão da Empresa"
  },
  {
    name: "cnpjEmpresa",
    value: values.cnpjEmpresa,
    onChange: onChange,
    placeholder: "CNPJ da Empresa",
    dica: "CNPJ da Empresa"
  },
  {
    name: "nomeEmpresa",
    value: values.nomeEmpresa,
    onChange: onChange,
    placeholder: "Nome da Empresa",
    dica: "Nome da Empresa"
  }
];

// 2. Dados da Proposta
export const inputsDadosProposta = ({ values, onChange }: IDados): Inputs[] => [
  {
    name: "codigoProposta",
    value: values.codigoProposta,
    onChange: onChange,
    placeholder: "Código da Proposta",
    dica: "Código da Proposta"
  },
  {
    name: "entradaProposta",
    value: values.entradaProposta,
    onChange: onChange,
    placeholder: "Entrada da Proposta",
    dica: "Entrada da Proposta",
    type: "date"
  },
  {
    name: "dataProposta",
    value: values.dataProposta,
    onChange: onChange,
    placeholder: "Data da Proposta",
    dica: "Data da Proposta",
    type: "date"
  },

  {
    name: "validadeProposta",
    value: values.validadeProposta,
    onChange: onChange,
    placeholder: "Validade da Proposta",
    dica: "Validade da Proposta"
  }
];

// 3. Valores da Proposta
export const inputsValoresProposta = ({ values, onChange }: IDados): Inputs[] => [
  {
    name: "valorTecnico",
    value: values.valorTecnico,
    onChange: onChange,
    placeholder: "Valor Técnico",
    dica: "Valor Técnico"
  },
  {
    name: "valorKM",
    value: values.valorKM,
    onChange: onChange,
    placeholder: "Valor por KM",
    dica: "Valor por KM"
  },
  {
    name: "valorDiaria",
    value: values.valorDiaria,
    onChange: onChange,
    placeholder: "Valor da Diária",
    dica: "Valor da Diária"
  },
  {
    name: "condicaoPagamento",
    value: values.condicaoPagamento,
    onChange: onChange,
    placeholder: "Condição de Pagamento",
    dica: "Condição de Pagamento"
  }
];

// 4. Dados do Tomador
export const inputsDadosTomador = ({ values, onChange }: IDados): Inputs[] => [
  {
    name: "nomeTomador",
    value: values.nomeTomador,
    onChange: onChange,
    placeholder: "Nome do Tomador",
    dica: "Nome do Tomador"
  },
  {
    name: "emailTomador",
    value: values.emailTomador,
    onChange: onChange,
    placeholder: "Email do Tomador",
    dica: "Email do Tomador"
  },
  {
    name: "telefone1Tomador",
    value: values.telefone1Tomador,
    onChange: onChange,
    placeholder: "Telefone 1 do Tomador",
    dica: "Telefone 1 do Tomador"
  },
  {
    name: "telefone2Tomador",
    value: values.telefone2Tomador,
    onChange: onChange,
    placeholder: "Telefone 2 do Tomador",
    dica: "Telefone 2 do Tomador"
  },
  {
    name: "departamentoTomador",
    value: values.departamentoTomador,
    onChange: onChange,
    placeholder: "Departamento do Tomador",
    dica: "Departamento do Tomador"
  }
];

// 5. Dados do Vendedor
export const inputsDadosVendedor = ({ values, onChange }: IDados): Inputs[] => [
  {
    name: "nomeVendedor",
    value: values.nomeVendedor,
    onChange: onChange,
    placeholder: "Nome do Vendedor",
    dica: "Nome do Vendedor"
  },
  {
    name: "emailVendedor",
    value: values.emailVendedor,
    onChange: onChange,
    placeholder: "Email do Vendedor",
    dica: "Email do Vendedor"
  },
  {
    name: "telefone1Vendedor",
    value: values.telefone1Vendedor,
    onChange: onChange,
    placeholder: "Telefone 1 do Vendedor",
    dica: "Telefone 1 do Vendedor"
  },
  {
    name: "telefone2Vendedor",
    value: values.telefone2Vendedor,
    onChange: onChange,
    placeholder: "Telefone 2 do Vendedor",
    dica: "Telefone 2 do Vendedor"
  },
  {
    name: "departamentoVendedor",
    value: values.departamentoVendedor,
    onChange: onChange,
    placeholder: "Departamento do Vendedor",
    dica: "Departamento do Vendedor"
  }
];
